export interface PostReport {
  /**
   * Total number of users in the system
   */
  totalPosts: number;

  /**
   * Number of new users registered in the reporting period
   */
  newPosts: number;

  /**
   * Number of currently banned users
   */
  deletedPosts: number;

  /**
   * User retention rate (percentage)
   * Range: 0-100
   */
  growthRate: number;

}
