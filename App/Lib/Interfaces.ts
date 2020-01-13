export interface IUserData{
    userId: string,
    userName: string,
    emailId: string,
    accessToken: string,
}
export interface IUserRequest{
    socialType: string;
    deviecId: string;
    deviceType: string;
    // userName: string;
    emailId: string;
    password: string;
}