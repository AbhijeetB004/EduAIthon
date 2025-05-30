import { Fragment, useEffect } from "react";
import { useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import { Button, IconButton } from "@mui/material";
import logo from "../assets/logo-hck.svg";
import ExpIcon from "../assets/exp-icon.png";
import DailyModal from "./DailyModal";
import NotiModal from "./NotiModal";
import EmailIcon from "@mui/icons-material/Email";
import { Leaderboard, Logout, Person, Stream } from "@mui/icons-material";
import { AiOutlineProfile } from "react-icons/ai";
import { RiProfileLine } from "react-icons/ri";
import { jwtDecode } from 'jwt-decode';

const navigation = [
  { name: "Home", href: "/home", current: false },
  { name: "Financial Habits", href: "/tasks", current: false },
  // { name: "Smart Investing", href: "/stock", current: false },
  // { name: "Smart Savings", href: "/savings", current: false },
  { name: "Learning", href: "/learning", current: false },
  { name: "Party", href: "/party", current: false },
  { name: "Blog", href: "/blog", current: false },
  { name: "Games", href: "/games", current: false },
];

const adminNavigation = [
  { name: "Manage Lessons", href: "/admin/lessons", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavBar() {
  const [path, setPath] = useState(window.location.pathname);
  const getInitialUser = () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        const decodedToken = jwtDecode(token);
        const userData = JSON.parse(storedUser);
        return { ...userData, isAdmin: decodedToken.isAdmin };
      } catch (e) {
        console.error("Error parsing user data", e);
        return null;
      }
    }
    return null;
  };
  const [user, setUser] = useState(getInitialUser);
  const userPfpFromRedux = useSelector((state) => state.pfp.userPfp);
  const [pfp, setPfp] = useState(user?.pfp || null);
  const [mopen, setOpen] = useState(false);
  const [nopen, setNOpen] = useState(false);

  const openNewPage = () => {
    window.open("http://localhost:9000/", "_blank");
  };
  const handleNOpen = () => {
    setNOpen(true);
  };

  const handleNClose = () => {
    setNOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const currentUser = JSON.parse(storedUser);
        setUser(currentUser);
        setPfp(currentUser.pfp);
      } catch (e) {
        console.error("Error parsing user from localStorage in useEffect", e);
        setUser(null);
        setPfp(null);
      }
    } else {
      setUser(null);
      setPfp(null);
    }
  }, [userPfpFromRedux]);

  useEffect(() => {
    setPath(window.location.pathname);
  }, [window.location.pathname]);

  const isAdmin = user?.isAdmin;

  return (
    <Disclosure as="nav" className="bg-[#33006F] sticky top-0 z-[999]">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo and brand name */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img className="h-8 w-auto" src={logo} alt="FinEdu" />
                  <span className="font-bold text-white tracking-wide ml-2 text-xl">
                    FinEdu
                  </span>
                </div>

                {/* Desktop navigation */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.href === path
                            ? "bg-gray-900 underline font-bold"
                            : "hover:underline",
                          "rounded-md px-3 py-2 text-sm text-white"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                    {isAdmin && adminNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.href === path
                            ? "bg-gray-900 underline font-bold"
                            : "hover:underline",
                          "rounded-md px-3 py-2 text-sm text-white"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side icons and profile */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {mopen && <DailyModal open={mopen} handleClose={handleClose} />}
                {nopen && (
                  <NotiModal
                    open={nopen}
                    handleClose={handleNClose}
                    userInfo={user}
                  />
                )}
                {user && (
                  <>
                    <div className="hidden sm:block mr-4">
                      <IconButton
                        onClick={handleClickOpen}
                        style={{
                          backgroundColor: "#33006F",
                          color: "white",
                        }}
                      >
                        <WhatshotOutlinedIcon />
                      </IconButton>
                    </div>
                    <div className="hidden sm:block mr-4">
                      <IconButton
                        onClick={handleNOpen}
                        style={{
                          backgroundColor: "#33006F",
                          color: "white",
                        }}
                      >
                        <EmailIcon />
                      </IconButton>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 mr-8 text-white">
                      <img src={ExpIcon} alt="Level" className="h-8 w-8" />
                      <span className="font-semibold tracking-wide">
                        Level {user.level || 1}
                      </span>
                    </div>
                  </>
                )}
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.pfp || "/default-avatar.png"}
                          alt="Profile"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:font-bold"
                              )}
                            >
                              <Person /> Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/leaderboard"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:font-bold"
                              )}
                            >
                              <Leaderboard /> LeaderBoard
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              type="button"
                              onClick={openNewPage}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:font-bold"
                              )}
                            >
                              <Stream />
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={() => {
                                localStorage.clear();
                                setUser(null);
                                setPfp(null);
                                window.location.href = "/login";
                              }}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                            >
                              <Logout /> Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  path !== "/login" && (
                    <Button href="/login" style={{ color: "white" }}>Login</Button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.href === path
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {isAdmin && adminNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.href === path
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {user && (
                <>
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 text-white">
                      <img src={ExpIcon} alt="Level" className="h-6 w-6" />
                      <span className="font-semibold">Level {user.level || 1}</span>
                    </div>
                    <div className="flex gap-2">
                      <IconButton
                        onClick={handleClickOpen}
                        style={{
                          backgroundColor: "#33006F",
                          color: "white",
                        }}
                      >
                        <WhatshotOutlinedIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleNOpen}
                        style={{
                          backgroundColor: "#33006F",
                          color: "white",
                        }}
                      >
                        <EmailIcon />
                      </IconButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default NavBar;
