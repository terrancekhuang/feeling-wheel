declare module "*.yaml" {
  const data: import("./content").Emotion[];
  export default data;
  export const drafts: boolean;
}
