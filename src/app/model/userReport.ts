export interface UserReport {
  /**
   * Total number of users in the system
   */
  totalUsers: number;

  /**
   * Number of new users registered in the reporting period
   */
  newUsers: number;

  /**
   * Number of currently banned users
   */
  bannedUsers: number;

  /**
   * User retention rate (percentage)
   * Range: 0-100
   */
  retentionRate: number;

  /**
   * User growth rate (percentage change compared to previous period)
   * Can be positive or negative
   */
  growthRate: number;
}
