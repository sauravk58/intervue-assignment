import { polls, responses, sessions, users, type Poll, type Response, type Session, type User, type InsertPoll, type InsertResponse, type InsertSession, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createPoll(poll: InsertPoll): Promise<Poll>;
  getActivePoll(): Promise<Poll | undefined>;
  getAllPolls(): Promise<Poll[]>;
  updatePollStatus(id: number, isActive: boolean, endedAt?: Date): Promise<Poll | undefined>;
  
  createResponse(response: InsertResponse): Promise<Response>;
  getResponsesByPollId(pollId: number): Promise<Response[]>;
  
  createSession(session: InsertSession): Promise<Session>;
  getActiveSessions(): Promise<Session[]>;
  updateSessionStatus(studentName: string, isActive: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private polls: Map<number, Poll>;
  private responses: Map<number, Response>;
  private sessions: Map<number, Session>;
  private currentUserId: number;
  private currentPollId: number;
  private currentResponseId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.polls = new Map();
    this.responses = new Map();
    this.sessions = new Map();
    this.currentUserId = 1;
    this.currentPollId = 1;
    this.currentResponseId = 1;
    this.currentSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPoll(insertPoll: InsertPoll): Promise<Poll> {
    const id = this.currentPollId++;
    const poll: Poll = {
      ...insertPoll,
      id,
      isActive: true,
      createdAt: new Date(),
      endedAt: null,
    };
    this.polls.set(id, poll);
    return poll;
  }

  async getActivePoll(): Promise<Poll | undefined> {
    return Array.from(this.polls.values()).find(poll => poll.isActive);
  }

  async getAllPolls(): Promise<Poll[]> {
    return Array.from(this.polls.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updatePollStatus(id: number, isActive: boolean, endedAt?: Date): Promise<Poll | undefined> {
    const poll = this.polls.get(id);
    if (poll) {
      const updatedPoll = { ...poll, isActive, endedAt: endedAt || null };
      this.polls.set(id, updatedPoll);
      return updatedPoll;
    }
    return undefined;
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = this.currentResponseId++;
    const response: Response = {
      ...insertResponse,
      id,
      submittedAt: new Date(),
    };
    this.responses.set(id, response);
    return response;
  }

  async getResponsesByPollId(pollId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(
      response => response.pollId === pollId
    );
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = {
      ...insertSession,
      id,
      isActive: true,
      connectedAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getActiveSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      session => session.isActive
    );
  }

  async updateSessionStatus(studentName: string, isActive: boolean): Promise<void> {
    const session = Array.from(this.sessions.values()).find(
      s => s.studentName === studentName
    );
    if (session) {
      const updatedSession = { ...session, isActive };
      this.sessions.set(session.id, updatedSession);
    }
  }
}

export const storage = new MemStorage();
