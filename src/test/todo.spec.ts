import request from "supertest";
import app from "../..";
import { prisma } from "../config/db.config";

jest.mock("../config/db.config", () => ({
  prisma: {
    todo: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe("Todo Post Request /api/v1/todos/", () => {
  it("should create a todo item", async () => {
    (prisma.todo.create as jest.Mock).mockResolvedValue({
      id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
      title: "hello world",
      description:
        "this is a pretty long description and now let's see what happend when we use this description.",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).post("/api/v1/todos/").send({
      title: "hello world",
      description:
        "this is a pretty long description and now let's see what happend when we use this description.",
      completed: false,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Todo Created");
  });

  it("should throw a validation error", async () => {
    const response = await request(app).post("/api/v1/todos/").send({
      title: "vi",
      description: "this is pretty",
      completed: false,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Validation Error");
  });

  it("should throw a invalid data error", async () => {
    (prisma.todo.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const response = await request(app).post("/api/v1/todos/").send({
      title: "hello world 2",
      description:
        "new data here ccheck iof we can recieve invalid data error here",
      completed: false,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Cannot create todo");
  });
});

describe("Todo Update /api/v1/todos", () => {
  it("should update the todo properly", async () => {
    (prisma.todo.update as jest.Mock).mockResolvedValue({
      id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
      title: "hello world updated",
      description:
        "new data here ccheck iof we can recieve invalid data error here",
      completed: false,
    });

    const response = await request(app)
      .put("/api/v1/todos/ba128dbb-f058-47bc-92fe-aafb1e804885")
      .send({
        id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
        title: "hello world updated",
        description:
          "new data here ccheck iof we can recieve invalid data error here",
        completed: true,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Todo Updated");
  });

  it("should return a validation error", async () => {
    (prisma.todo.update as jest.Mock).mockResolvedValue({
      id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
      title: "hello world updated",
      description:
        "new data here ccheck iof we can recieve invalid data error here",
      completed: false,
    });

    const response = await request(app)
      .put("/api/v1/todos/ba128dbb-f058-47bc-92fe-aafb1e804885")
      .send({
        id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
        title: "hello world updated",
        description:
          "new data here ccheck iof we can recieve invalid data error here",
        completed: null,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Validation Error");
  });

  it("should return a unable to update error", async () => {
    (prisma.todo.update as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const response = await request(app)
      .put("/api/v1/todos/ba128dbb-f058-47bc-92fe-aafb1e804885")
      .send({
        id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
        title: "hello world updated",
        description:
          "new data here ccheck iof we can recieve invalid data error here",
        completed: true,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Unable to update");
  });
});

describe("Todo Delete /api/v1/todos/delete/:id ", () => {
  it("should delete the todo exist in db", async () => {
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue({
      id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
      title: "hello world updated",
      description:
        "new data here ccheck iof we can recieve invalid data error here",
      completed: true,
    });

    (prisma.todo.delete as jest.Mock).mockResolvedValue({
      id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
      title: "hello world updated",
      description:
        "new data here ccheck iof we can recieve invalid data error here",
      completed: true,
    });

    const response = await request(app)
      .delete("/api/v1/todos/delete/ba128dbb-f058-47bc-92fe-aafb1e804885")
      .send({
        id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
        title: "hello world updated",
        description:
          "new data here ccheck iof we can recieve invalid data error here",
        completed: true,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Todo Deleted");
  });

  it("should return data not exist in db", async () => {
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(null);

    (prisma.todo.delete as jest.Mock).mockResolvedValue({
      id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
      title: "hello world updated",
      description:
        "new data here ccheck iof we can recieve invalid data error here",
      completed: true,
    });

    const response = await request(app)
      .delete("/api/v1/todos/delete/ba128dbb-f058-47bc-92fe-aafb1e8048")
      .send({
        id: "ba128dbb-f058-47bc-92fe-aafb1e804885",
        title: "hello world updated",
        description:
          "new data here ccheck iof we can recieve invalid data error here",
        completed: true,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Data not valid");
  });
});
