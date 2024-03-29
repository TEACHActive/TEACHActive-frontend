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
  AudioInFrame,
  InstructorNameResponse,
  TotalSpeechTimesInSessionResponse,
} from "./types";
import {
  Reflections,
  ReflectionSectionQuestionOnSelected,
} from "pages/goals/goalsPage.types";
// import { HandRaiseGoalsAndReflections } from "pages/goals/goalsPage.types";

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
  getSessionPerformance(sessionId: string): Promise<number>;
  getStudentSpeechInSession(sessionId: string): Promise<AudioInFrame[] | null>;
  getInstructorSpeechInSession(
    sessionId: string
  ): Promise<AudioInFrame[] | null>;
  getStudentSpeechFrameNumberInSession(
    sessionId: string,
    threashold: number
  ): Promise<number>;
  updateSessionPerformance(
    sessionId: string,
    preformance: number
  ): Promise<BaseSession | null>;
  updateSessionName(
    sessionId: string,
    name: string
  ): Promise<BaseSession | null>; //Should probably require a uid for any updates
  getTotalSpeechTimesInSession(
    sessionId: string
  ): Promise<Response<TotalSpeechTimesInSessionResponse> | null>;
  //Reflections
  getReflections(
    sessionId: string,
    userUID: string
  ): Promise<Reflections | null>;
  createReflections(
    sessionId: string,
    userUID: string
  ): Promise<Reflections | null>;
  updateReflections(
    sessionId: string,
    userUID: string,
    reflectionObj: object
  ): Promise<Reflections | null>;
  getInstructorName(userUID: string): Promise<InstructorNameResponse | null>;
  //Other
}

export class APIHandler implements IAPIHandler {
  getSessions = async (uid: string): Promise<BaseSession[]> => {
    const config = getAxiosConfig(MethodType.GET, `/edusense/sessions/${uid}`);
    // console.log(config);

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

  getSessionPerformance = async (sessionId: string): Promise<number> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/metadata/performance/${sessionId}`
    );

    try {
      const response = await axios.request(config);
      return response.data.data || null;
    } catch (error) {
      // logAPIError("Failed to get session Performance", error);
      return 0;
    }
  };

  getStudentSpeechInSession = async (
    sessionId: string
  ): Promise<AudioInFrame[] | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/student/speech/frames/${sessionId}`
    );

    try {
      const axiosResponse = await axios.request(config);

      const response = new Response(
        axiosResponse,
        new ClassArrayFactory<AudioInFrame>().transformToClass(AudioInFrame)
      );

      return response.data?.arr || null;
    } catch (error) {
      logAPIError("Failed to get audio frames", error);
      return null;
    }
  };
  getInstructorSpeechInSession = async (
    sessionId: string
  ): Promise<AudioInFrame[] | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/instructor/speech/frames/${sessionId}`
    );

    try {
      const axiosResponse = await axios.request(config);

      const response = new Response(
        axiosResponse,
        new ClassArrayFactory<AudioInFrame>().transformToClass(AudioInFrame)
      );

      return response.data?.arr || null;
    } catch (error) {
      logAPIError("Failed to get audio frames", error);
      return null;
    }
  };
  getStudentSpeechFrameNumberInSession = async (
    sessionId: string,
    threashold: number
  ): Promise<number> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/student/speech/${sessionId}/${threashold}`
    );

    try {
      const response = await axios.request(config);
      return response.data.frames;
    } catch (error) {
      logAPIError(
        "Failed to get Student Speech Frame Number In Session",
        error
      );
      return 0;
    }
  };

  getTotalSpeechTimesInSession = async (
    sessionId: string
  ): Promise<Response<TotalSpeechTimesInSessionResponse> | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/edusense/speech/time/${sessionId}`
    );

    try {
      const response = new Response(
        await (await axios.request(config)).data,
        TotalSpeechTimesInSessionResponse
      );
      return response;
    } catch (error) {
      logAPIError(
        "Failed to get Student Speech Frame Number In Session",
        error
      );
      return null;
    }
  };

  updateSessionPerformance = async (
    sessionId: string,
    preformance: number
  ): Promise<BaseSession | null> => {
    const config = getAxiosConfig(
      MethodType.PUT,
      `/metadata/performance/${sessionId}`,
      {
        performance: preformance,
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
    const config = getAxiosConfig(MethodType.PUT, `/edusense/sessions/name`, {
      sessionId: sessionId,
      name: name,
    });

    try {
      const response = new Response(await axios.request(config), BaseSession);

      return response.data || null;
    } catch (error) {
      console.log(error);

      logAPIError("Failed to set session name", error);
      return null;
    }
  };

  getReflections = async (
    sessionId: string,
    userUID: string
  ): Promise<Reflections | null> => {
    let config = getAxiosConfig(
      MethodType.GET,
      `/reflections/${userUID}/${sessionId}`
    );

    let response;

    try {
      response = new Response(await axios.request(config), Reflections);

      return response.data ? new Reflections(response.data) : null;
    } catch (error) {
      logAPIError("Failed to get reflections", error);
    }

    return await this.createReflections(sessionId, userUID);
  };

  createReflections = async (
    sessionId: string,
    userUID: string
  ): Promise<Reflections | null> => {
    const config = getAxiosConfig(
      MethodType.POST,
      `/reflections/${userUID}/${sessionId}`
    );

    try {
      const response = new Response(await axios.request(config), Reflections);
      return response.data ? new Reflections(response.data) : null;
    } catch (error) {
      logAPIError("Failed to create reflections", error);
      return null;
    }
  };

  updateReflections = async (
    sessionId: string,
    userUID: string,
    reflectionObj: object
  ): Promise<Reflections | null> => {
    const config = getAxiosConfig(
      MethodType.PUT,
      `/reflections/${userUID}/${sessionId}`,
      reflectionObj
    );

    try {
      const response = new Response(await axios.request(config), Reflections);
      return response.data ? new Reflections(response.data) : null;
    } catch (error) {
      logAPIError("Failed to update reflections", error);
      return null;
    }
  };

  getInstructorName = async (
    userUID: string
  ): Promise<InstructorNameResponse | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/teachactive/name/${userUID}`
    );

    try {
      const response = await axios.request(config);

      return new Response(response.data, InstructorNameResponse).data;
    } catch (error) {
      logAPIError("Failed to get Instructor Name", error);
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
