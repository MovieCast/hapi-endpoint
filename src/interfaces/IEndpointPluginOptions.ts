export interface IEndpointPluginOptions {
  path: string
  version: number
  validVersions?: number[]
  // prefix?: string // Can be done with Hapi itself.
  fileExtensions?: string[]
}