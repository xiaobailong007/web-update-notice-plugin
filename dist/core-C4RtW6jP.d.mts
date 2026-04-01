//#region src/core.d.ts
interface Options {
  /**
   * Interval to check for updates (in milliseconds)
   * @default 1 * 60 * 1000 (1 minutes)
   */
  checkInterval?: number;
  /**
   * Base URL for the version.json request
   * @default '/'
   */
  base?: string;
  /**
   * Whether to auto refresh the page when an update is found
   * @default true
   */
  autoRefresh?: boolean;
  /**
   * Whether to show buttons
   * @default true
   */
  showButtons?: boolean;
  /**
   * Custom text configuration
   */
  text?: {
    title?: string;
    desc?: string;
    cancel?: string;
    confirm?: string;
  };
  /**
   * Whether to hide the default notification. Set to true if you want to use a custom dialog by listening to 'plugin-web-update-notice' event.
   * @default false
   */
  hiddenDefaultNotification?: boolean;
  /**
   * Custom notification HTML string.
   */
  customNotificationHTML?: string;
}
//#endregion
export { Options as t };