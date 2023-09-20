import { Metadata } from "next";
import { Container, Unstable_Grid2 } from "@mui/material";

import { UsersDataGrid } from "@/features";
import { Widget } from "@/components";
import { ENV, ENDPOINTS } from "@/constants";
import { User } from "@/types";

import { GetResponse } from "@/app/api/users/route";

export const metadata: Metadata = {
  title: "Usuarios",
};

const UsersPage: React.FC = async () => {
  const users = await getUsers();

  const title = `Usuarios (${users.length.toLocaleString()})`;

  return (
    <Container
      fixed
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
        paddingY: 2,
      }}
    >
      <Unstable_Grid2
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ height: "fit-content" }}
      >
        <Unstable_Grid2 xs={12}>
          <Widget height={500}>
            <UsersDataGrid title={title} users={users} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  );
};

async function getUsers(): Promise<User[]> {
  const url = new URL(ENDPOINTS.USERS, ENV.NEXT_PUBLIC_SITE_URL);

  const response = await fetch(url, { cache: "no-cache" });

  const { data, error }: GetResponse = await response.json();

  if (error) throw new Error(error);

  return data ?? [];
}

export default UsersPage;
