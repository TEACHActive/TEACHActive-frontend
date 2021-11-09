import { Breadcrumb, Layout } from "antd";

const { Content } = Layout;

export function WithBreadcrumbs(
  { children }: { children: JSX.Element },
  breadcrumbs: React.ReactNode[]
) {
  //   const [user, loading, error] = useAuthState(auth);
  //   let location = useLocation();

  //   if (loading) {
  //     return <Spin />;
  //   }

  //   if (error) {
  //     logger.error(error.message, () =>
  //       message.error("Error logging in: " + error.message)
  //     );
  //     return <Navigate to={LogInRoute.link()} state={{ from: location }} />;
  //   }

  //   if (!user) {
  //     // From: https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth?file=src%2FApp.tsx
  //     // Redirect them to the /login page, but save the current location they were
  //     // trying to go to when they were redirected. This allows us to send them
  //     // along to that page after they login, which is a nicer user experience
  //     // than dropping them off on the home page.
  //     return <Navigate to={LogInRoute.link()} state={{ from: location }} />;
  //   }

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        {breadcrumbs.map((crumb, i) => (
          <Breadcrumb.Item key={i}>{crumb}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: "#fff",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
