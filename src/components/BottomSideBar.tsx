import BookIcon from "@mui/icons-material/Book";
import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

export default function Bottomsidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const getValueFromPath = () => {
    if (pathname?.includes("/main/chat")) return 1;
    if (pathname?.includes("/main/diario")) return 2;
    if (pathname?.includes("/main/menu")) return 3;
    return 0;
  };
  const [value, setValue] = React.useState(getValueFromPath());
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        router.push("/main");
        break;
      case 1:
        router.push("/main/chat");
        break;
      case 2:
        router.push("/main/diario");
        break;
      case 3:
        router.push("/main/bonito");
        break;
      default:
        router.push("/main");
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{
          borderTop: 1,
          borderColor: "divider",
          "& .MuiBottomNavigationAction-root.Mui-selected": {
            color: "#FA506D",
          },
        }}
      >
        <BottomNavigationAction label="Menu" icon={<HomeIcon />} />
        <BottomNavigationAction label="Chssat" icon={<ChatIcon />} />
        <BottomNavigationAction label="Diario" icon={<BookIcon />} />
        <BottomNavigationAction label="?" icon={<QuestionMarkIcon />} />
      </BottomNavigation>
    </Box>
  );
}
