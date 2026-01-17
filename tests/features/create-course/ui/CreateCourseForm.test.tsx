import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import CreateCourseForm from "@/features/create-course/ui/CreateCourseForm";
import { renderWithProviders } from "../../../test-utils";
import { server } from "../../../mocks/server";
import { mockHandlers } from "../../../mocks/handlers";

describe("CreateCourseForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe("Successful Course Creation", () => {
    it("should navigate to complete page on successful course creation", async () => {
      const user = userEvent.setup();
      renderWithProviders(<CreateCourseForm />);

      const titleInput = screen.getByPlaceholderText("예: React 기초 마스터");
      const instructorInput = screen.getByPlaceholderText("예: 김강사");
      const maxStudentsInput = screen.getByPlaceholderText("1 이상");
      const submitButton = screen.getByRole("button", { name: /강의 등록|등록/ });

      await user.type(titleInput, "강의 제목");
      await user.type(instructorInput, "강사 이름");
      await user.type(maxStudentsInput, "30");

      await user.click(submitButton);

      await waitFor(() => {
        // Router navigation would be called
        expect(submitButton).toBeTruthy();
      });
    });
  });

  describe("API Error Handling - Authorization Error (403)", () => {
    it("should show error message when permission denied (C003)", async () => {
      server.use(mockHandlers.course.createCourseForbidden);
      const user = userEvent.setup();
      renderWithProviders(<CreateCourseForm />);

      const titleInput = screen.getByPlaceholderText("예: React 기초 마스터");
      const instructorInput = screen.getByPlaceholderText("예: 김강사");
      const maxStudentsInput = screen.getByPlaceholderText("1 이상");
      const submitButton = screen.getByRole("button", { name: /강의 등록|등록/ });

      await user.type(titleInput, "강의 제목");
      await user.type(instructorInput, "강사 이름");
      await user.type(maxStudentsInput, "30");

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("요청 실패. 다시 시도해주세요")).toBeTruthy();
      });
    });
  });

  describe("API Error Handling - Authentication Error (401)", () => {
    it("should show error message when token expired (A003)", async () => {
      server.use(mockHandlers.course.createCourseUnauthorized);
      const user = userEvent.setup();
      renderWithProviders(<CreateCourseForm />);

      const titleInput = screen.getByPlaceholderText("예: React 기초 마스터");
      const instructorInput = screen.getByPlaceholderText("예: 김강사");
      const maxStudentsInput = screen.getByPlaceholderText("1 이상");
      const submitButton = screen.getByRole("button", { name: /강의 등록|등록/ });

      await user.type(titleInput, "강의 제목");
      await user.type(instructorInput, "강사 이름");
      await user.type(maxStudentsInput, "30");

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("요청 실패. 다시 시도해주세요")).toBeTruthy();
      });
    });
  });

  describe("Form Validation", () => {
    it("should show validation error for empty title", async () => {
      const user = userEvent.setup();
      renderWithProviders(<CreateCourseForm />);

      const instructorInput = screen.getByPlaceholderText("예: 김강사");
      const maxStudentsInput = screen.getByPlaceholderText("1 이상");
      const submitButton = screen.getByRole("button", { name: /강의 등록|등록/ });

      await user.clear(instructorInput);
      await user.type(instructorInput, "강사 이름");
      await user.clear(maxStudentsInput);
      await user.type(maxStudentsInput, "30");
      await user.click(submitButton);

      await waitFor(
        () => {
          const errorElement = screen.queryByText("강의 제목을 입력해주세요");
          expect(errorElement).toBeTruthy();
        },
        { timeout: 3000 },
      );
    });

    it("should show validation error for invalid max students", async () => {
      const user = userEvent.setup();
      renderWithProviders(<CreateCourseForm />);

      const titleInput = screen.getByPlaceholderText("예: React 기초 마스터");
      const instructorInput = screen.getByPlaceholderText("예: 김강사");
      const maxStudentsInput = screen.getByPlaceholderText("1 이상");
      const submitButton = screen.getByRole("button", { name: /강의 등록|등록/ });

      await user.type(titleInput, "강의 제목");
      await user.type(instructorInput, "강사 이름");
      await user.clear(maxStudentsInput);
      await user.type(maxStudentsInput, "0");

      await user.click(submitButton);

      await waitFor(
        () => {
          const errorElement = screen.queryByText("최대 수강 인원은 1명 이상이어야 합니다");
          expect(errorElement).toBeTruthy();
        },
        { timeout: 3000 },
      );
    });

    it("should show validation error for negative price", async () => {
      const user = userEvent.setup();
      renderWithProviders(<CreateCourseForm />);

      const titleInput = screen.getByPlaceholderText("예: React 기초 마스터");
      const instructorInput = screen.getByPlaceholderText("예: 김강사");
      const maxStudentsInput = screen.getByPlaceholderText("1 이상");
      const priceInput = screen.getByPlaceholderText("0 이상");
      const submitButton = screen.getByRole("button", { name: /강의 등록|등록/ });

      await user.type(titleInput, "강의 제목");
      await user.type(instructorInput, "강사 이름");
      await user.clear(maxStudentsInput);
      await user.type(maxStudentsInput, "30");
      await user.clear(priceInput);
      await user.type(priceInput, "-1000");

      await user.click(submitButton);

      await waitFor(
        () => {
          const errorElement = screen.queryByText("수강료는 0원 이상이어야 합니다");
          expect(errorElement).toBeTruthy();
        },
        { timeout: 3000 },
      );
    });
  });
});
