export async function getServerSideProps(context: { req: { cookies: any } }) {
  console.log("Cookies in getServerSideProps:", context.req.cookies);
  return { props: {} };
}
