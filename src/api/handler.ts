import { message } from "antd";
import axios from "axios";
import { BaseSession, SessionResponse, VideoFrameSession } from "./types";
import { getAxiosConfig } from "./util";

export interface IAPIHandler {
  getAllSessionIDs(): Promise<BaseSession[]>;
  getSessionsByUID(uid: string): Promise<BaseSession[]>;
  getFramesBySessionID(
    sessionID: string,
    channel: "student" | "instructor"
  ): Promise<VideoFrameSession[]>;
}

export class APIHandler implements IAPIHandler {
  getAllSessionIDs = async (): Promise<BaseSession[]> => {
    const data = JSON.stringify({
      query: `{
                sessions {
                    id
                    createdAt {
                        unixSeconds
                    }
                }
            }`,
      variables: {},
    });

    const config = getAxiosConfig("post", "/query", data);

    try {
      const response = await axios.request(config);

      const baseSessionResponse = new SessionResponse<BaseSession>(
        {
          sessions: JSON.parse(response.data.response).data.sessions,
          success: response.data.success,
        },
        BaseSession
      );
      if (!baseSessionResponse.success) {
        message.error("An error occured");
      }
      return baseSessionResponse.sessions;
    } catch (e) {
      console.error(e);
      message.error(e);
      return [];
    }
  };

  getSessionsByUID = async (uid: string): Promise<BaseSession[]> => {
    const data = JSON.stringify({
      query: `{
                sessions(keyword: "${uid}") { 
                    id
                    createdAt {
                        unixSeconds
                    }
                }
            }`,
      variables: {},
    });

    const config = getAxiosConfig("post", "/query", data);

    try {
      const response = await axios.request(config);

      const baseSessionResponse = new SessionResponse<BaseSession>(
        {
          sessions: JSON.parse(response.data.response).data.sessions,
          success: response.data.success,
        },
        BaseSession
      );
      if (!baseSessionResponse.success) {
        message.error("An error occured");
      }
      return baseSessionResponse.sessions;
    } catch (e) {
      console.error(e);
      message.error(e);
      return [];
    }
  };

  getFramesBySessionID = async (
    sessionID: string,
    channel: "student" | "instructor"
  ): Promise<VideoFrameSession[]> => {
    var data = JSON.stringify({
      query: `{
              sessions(sessionId: "${sessionID}") { 
                  id
                  createdAt { 
                    unixSeconds
                  }
                  videoFrames(schema: "0.1.0", channel: ${channel}) { 
                      frameNumber
                      timestamp {
                          unixSeconds
                      }
                      people { 
                          openposeId 
                          inference { 
                              trackingId 
                              posture { 
                                  armPose 
                                  sitStand
                              }
                          }
                      } 
                  }
              }
          }`,
      variables: {},
    });

    const config = getAxiosConfig("post", "/query", data);

    try {
      const response = await axios.request(config);

      const videoFrameSessionResponse = new SessionResponse<VideoFrameSession>(
        {
          sessions: JSON.parse(response.data.response).data.sessions,
          success: response.data.success,
        },
        VideoFrameSession
      );
      if (!videoFrameSessionResponse.success) {
        message.error("An error occured");
      }

      return videoFrameSessionResponse.sessions;
    } catch (e) {
      console.error(e);
      message.error(e);
      return [];
    }
  };
}

const apiHandler: IAPIHandler = new APIHandler();

export default apiHandler;
