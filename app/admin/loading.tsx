import { Container } from "@mui/material";

import { Loader } from "@/components";

const AdminLoading: React.FC = () => (
  <Container fixed sx={{ paddingY: 2 }}>
    <Loader invisible />
  </Container>
);

export default AdminLoading;
