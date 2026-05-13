import { Link } from "react-router";
import { useAuth } from "../Store/authStore";
import {
  articleMeta,
  bodyText,
  pageBackground,
  pageTitleClass,
  pageWrapper,
  primaryBtn,
  secondaryBtn,
  section,
} from "../Styles/Common";

function Home() {
  const currentUser = useAuth((state) => state.currentUser);

  const role = currentUser?.role;
  const isUser = role === "USER";
  const isAdmin = role === "ADMIN";

  const heroTitle = isUser
    ? "Welcome back"
    : isAdmin
      ? "Welcome back"
      : "Welcome to Capstone Blog";

  const heroCopy = isUser
    ? "Articles are meant to be read here. Explore the latest posts and jump into a story that fits your mood."
    : isAdmin
      ? "Add your article, shape the conversation, and keep the home feed active with fresh content."
      : "Read sharp articles, publish from the dashboard, and keep your ideas moving in one place.";

  return (
    <div className={pageBackground}>
      <div className={!currentUser || isUser ? "min-h-[calc(100vh-72px)] px-4" : pageWrapper}>
        <section
          className={
            !currentUser || isUser
              ? "flex min-h-[calc(100vh-72px)] items-center justify-center"
              : `${section} grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-center`
          }
        >
          <div className={!currentUser || isUser ? "flex min-h-[calc(100vh-72px)] w-full flex-col items-center justify-center px-6 text-center" : ""}>
           
            <h1 className={`${pageTitleClass} ${!currentUser || isUser ? "mx-auto max-w-5xl text-5xl text-[#3858e9] sm:text-7xl" : ""}`}>
              {heroTitle}
            </h1>
            <p className={`${bodyText} max-w-3xl text-base sm:text-lg ${!currentUser || isUser ? "mx-auto mt-6 text-xl leading-8 text-[#2c46b5] sm:text-2xl" : ""}`}>
              {heroCopy}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
