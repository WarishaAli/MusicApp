// This is for the devscreens
import {createAPI} from "./GithubApi";
import { Observable } from "rxjs";
import { ApiResponse } from "apisauce";
import createHipHopApi from "./HipHopApis";
import { IUserData, IUserRequest } from "../Lib/Interfaces";

export default {
    create: {
    hiphop: createHipHopApi(),
    }
};

export interface Api{
    hiphop: HipHopApi,
};

export interface HipHopApi{
    login: (params: IUserRequest) => Observable<ApiResponse<IUserData>>; 
    getSongByCat: () => Observable<ApiResponse<any>>;
}
