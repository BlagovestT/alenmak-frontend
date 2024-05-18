import { Stack, Toolbar } from "@mui/material";
import Link from "next/link";
import logo from "../../../public/logo.png";
import Image from "next/image";

const Logo = () => {
  return (
    <Toolbar>
      <Link href="/">
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Image src={logo} height={60} alt="logo" />
        </Stack>
      </Link>
    </Toolbar>
  );
};

export default Logo;
