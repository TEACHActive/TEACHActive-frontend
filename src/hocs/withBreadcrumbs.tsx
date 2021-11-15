import { Breadcrumb, Layout } from "antd";

const { Content } = Layout;

export function WithBreadcrumbs(
  { children }: { children: JSX.Element },
  breadcrumbs: React.ReactNode[]
) {
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
