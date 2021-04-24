import axios from "axios";
import { message } from "antd";
import { DurationObjectUnits, DurationUnit } from "luxon";

import { getAxiosConfig } from "./util";
import {
  Channel,
  Response,
  MethodType,
  BaseSession,
  SitStandInFrame,
  ArmPosesInFrame,
  XPositionInFrame,
  VideoFrameSession,
  ClassArrayFactory,
  CumulativeArmPoses,
  StudentAttendenceStats,
} from "./types";

export interface IAPIHandler {
  //Edusense
  getSessions(uid: string): Promise<BaseSession[]>;
  getFrames(sessionId: string, channel: Channel): Promise<VideoFrameSession[]>;
  getNumberOfFramesOfArmPosesInSession(
    sessionId: string
  ): Promise<CumulativeArmPoses | null>;
  getArmPosesInSession(
    sessionId: string,
    durationUnit?: DurationUnit
  ): Promise<ArmPosesInFrame[] | null>;
  getStudentAttendenceStatsInSession(
    sessionId: string
  ): Promise<StudentAttendenceStats | null>;
  getInstructorMovement(
    sessionId: string,
    durationUnit?: DurationUnit
  ): Promise<XPositionInFrame[] | null>;
  getStudentSitVsStandInSession(
    sessionId: string,
    durationUnit?: DurationUnit
  ): Promise<SitStandInFrame[] | null>;
  //Metadata
  getSessionPerformance(sessionId: string): Promise<BaseSession | null>;
  updateSessionPerformance(
    sessionId: string,
    preformance: number
  ): Promise<BaseSession | null>;
  updateSessionName(
    sessionId: string,
    name: string
  ): Promise<BaseSession | null>; //Should probably require a uid for any updates
  //Reflections
  //Other
}

export class APIHandler implements IAPIHandler {
  getSessions = async (uid: string): Promise<BaseSession[]> => {
    const config = getAxiosConfig(MethodType.GET, `/edusense/sessions/${uid}`);

    try {
      const response = new Response(
        await axios.request(config),
        new ClassArrayFactory<BaseSession>().transformToClass(BaseSession)
      );

      return response.data?.arr || [];
    } catch (error) {
      logAPIError("Failed to get sessions", error);
      return [];
    }
  };
  getFrames = async (
    sessionId: string,
    channel: Channel
  ): Promise<VideoFrameSession[]> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/frames/${sessionId}/${channel}`
    );

    try {
      const response = new Response(
        await axios.request(config),
        new ClassArrayFactory<VideoFrameSession>().transformToClass(
          VideoFrameSession
        )
      );
      return response.data?.arr || [];
    } catch (error) {
      logAPIError("Failed to get frames", error);
      return [];
    }
  };
  getNumberOfFramesOfArmPosesInSession = async (
    sessionId: string
  ): Promise<CumulativeArmPoses | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/armPose/${sessionId}`
    );

    try {
      const response = new Response(
        await axios.request(config),
        CumulativeArmPoses
      );

      return response.data;
    } catch (error) {
      logAPIError("Failed to get arm pose stats", error);
      return null;
    }
  };
  getArmPosesInSession = async (
    sessionId: string,
    durationUnit: keyof DurationObjectUnits = "minutes" //Future ability to send this along as a param to the backend
  ): Promise<ArmPosesInFrame[] | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/armPose/frames/${sessionId}`
    );

    try {
      const response = new Response(
        await axios.request(config),
        new ClassArrayFactory<ArmPosesInFrame>().transformToClass(
          ArmPosesInFrame
        )
      );
      return response.data?.arr || null;
    } catch (error) {
      logAPIError("Failed to get arm pose frames", error);
      return null;
    }
  };
  getStudentAttendenceStatsInSession = async (
    sessionId: string
  ): Promise<StudentAttendenceStats | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/attendance/${sessionId}`
    );

    try {
      const response = new Response(
        await axios.request(config),
        StudentAttendenceStats
      );
      return response.data;
    } catch (error) {
      logAPIError("Failed to get student attendence stats", error);
      return null;
    }
  };
  getInstructorMovement = async (
    sessionId: string,
    durationUnit: keyof DurationObjectUnits = "minutes"
  ): Promise<XPositionInFrame[] | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/instructor/movement/${sessionId}`
    );

    try {
      const response = new Response(
        await axios.request(config),
        new ClassArrayFactory<XPositionInFrame>().transformToClass(
          XPositionInFrame
        )
      );
      return response.data?.arr || null;
    } catch (error) {
      logAPIError("Failed to get instructor movement frames", error);
      return null;
    }
  };
  getStudentSitVsStandInSession = async (
    sessionId: string,
    durationUnit: keyof DurationObjectUnits = "minutes"
  ): Promise<SitStandInFrame[] | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/student/sitvsstand/${sessionId}`
    );

    try {
      const response = new Response(
        await axios.request(config),
        new ClassArrayFactory<SitStandInFrame>().transformToClass(
          SitStandInFrame
        )
      );
      return response.data?.arr || null;
    } catch (error) {
      logAPIError("Failed to get sit stand frames", error);
      return null;
    }
  };
  getSessionPerformance = async (
    sessionId: string
  ): Promise<BaseSession | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/metadata/preformance/${sessionId}`
    );

    try {
      const response = new Response(await axios.request(config), BaseSession);
      return response.data || null;
    } catch (error) {
      logAPIError("Failed to get session preformance", error);
      return null;
    }
  };
  updateSessionPerformance = async (
    sessionId: string,
    preformance: number
  ): Promise<BaseSession | null> => {
    const config = getAxiosConfig(
      MethodType.PUT,
      `/metadata/preformance/${sessionId}`,
      {
        preformance: preformance,
      }
    );

    try {
      const response = new Response(await axios.request(config), BaseSession);
      return response.data || null;
    } catch (error) {
      logAPIError("Failed to set session preformance", error);
      return null;
    }
  };
  updateSessionName = async (
    sessionId: string,
    name: string
  ): Promise<BaseSession | null> => {
    const config = getAxiosConfig(
      MethodType.PUT,
      `/metadata/name/${sessionId}`,
      {
        name: name,
      }
    );

    try {
      const response = new Response(await axios.request(config), BaseSession);
      return response.data || null;
    } catch (error) {
      logAPIError("Failed to set session name", error);
      return null;
    }
  };
}

const logAPIError = (error: string, detail: any) => {
  console.error(error, detail);
  message.error(error);
};

const apiHandler: IAPIHandler = new APIHandler();

export default apiHandler;
