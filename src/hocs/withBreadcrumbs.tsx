import { Breadcrumb, Layout } from "antd";

const { Content } = Layout;

export function WithBreadcrumbs(
  { children }: { children: JSX.Element },
  breadcrumbs: React.ReactNode[]
) {
  return (
    <Layout>
      <Breadcrumb style={{ margin: "16px 16px", position: "absolute" }}>
        {breadcrumbs.map((crumb, i) => (
          <Breadcrumb.Item key={i}>{crumb}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 48,
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
