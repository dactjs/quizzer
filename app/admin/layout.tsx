import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import {
  CalendarMonth as AgendaIcon,
  Quiz as QuizzesIcon,
  PieChart as ReportsIcon,
  ManageAccounts as UsersIcon,
} from "@mui/icons-material";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import {
  Dashboard,
  DrawerNavigation,
  DrawerNavigationMenu,
  DrawerNavigationItem,
} from "@/components";
import { PAGES } from "@/constants";

import AdminDashboardAppBarContent from "./_components/AdminDashboardAppBarContent";
import AdminDashboardDrawerHeader from "./_components/AdminDashboardDrawerHeader";
import AdminDashboardDrawerFooter from "./_components/AdminDashboardDrawerFooter";

type Navigation =
  | {
      type: "MENU";
      menu: Omit<DrawerNavigationMenu, "items"> & {
        items: (DrawerNavigationItem & {
          show: boolean;
        })[];
      };
    }
  | {
      type: "ITEM";
      item: DrawerNavigationItem & {
        show: boolean;
      };
    };

const AdminLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  const navigation: Navigation[] = [
    {
      type: "ITEM",
      item: {
        show: true,
        label: "Agenda",
        icon: <AgendaIcon />,
        href: PAGES.ADMIN_AGENDA,
      },
    },
    {
      type: "ITEM",
      item: {
        show: true,
        label: "Exámenes",
        icon: <QuizzesIcon />,
        href: PAGES.ADMIN_QUIZZES,
      },
    },
    {
      type: "ITEM",
      item: {
        show: true,
        label: "Reportes",
        icon: <ReportsIcon />,
        href: PAGES.ADMIN_REPORTS,
      },
    },
    {
      type: "ITEM",
      item: {
        show: true,
        label: "Control de usuarios",
        icon: <UsersIcon />,
        href: PAGES.ADMIN_USERS,
      },
    },
  ];

  const allowedNavigation = navigation
    .filter((navigation) =>
      navigation.type === "MENU"
        ? navigation.menu.items.some((item) => item.show)
        : navigation.item.show
    )
    .map<DrawerNavigation>((navigation) =>
      navigation.type === "ITEM"
        ? {
            type: "ITEM",
            value: {
              label: navigation.item.label,
              icon: navigation.item.icon,
              href: navigation.item.href,
            },
          }
        : {
            type: "MENU",
            value: {
              label: navigation.menu.label,
              icon: navigation.menu.icon,
              items: navigation.menu.items
                .filter((item) => item.show)
                .map((item) => ({
                  label: item.label,
                  icon: item.icon,
                  href: item.href,
                })),
            },
          }
    );

  return (
    <Dashboard
      appBarContent={<AdminDashboardAppBarContent />}
      drawerHeader={<AdminDashboardDrawerHeader session={session as Session} />}
      drawerNavigationRootPaths={[PAGES.ROOT, PAGES.ADMIN_ROOT]}
      drawerNavigation={allowedNavigation}
      drawerFooter={<AdminDashboardDrawerFooter />}
    >
      {children}
    </Dashboard>
  );
};

export default AdminLayout;
