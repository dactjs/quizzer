import { Layout } from "@/components/Layout";

const ConvocatoriesLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => <Layout hideFooter>{children}</Layout>;

export default ConvocatoriesLayout;
