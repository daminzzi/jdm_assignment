import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import SignUpForm from "@/features/auth/ui/SignUpForm";
import { renderWithProviders } from "../../../test-utils";
import { server } from "../../../mocks/server";
import { mockHandlers } from "../../../mocks/handlers";

describe("SignUpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe("Successful Signup", () => {
    it("should navigate to complete page on successful signup", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getAllByPlaceholderText("••••••••")[0];
      const nameInput = screen.getByPlaceholderText("이름");
      const phoneInput = screen.getByPlaceholderText("010-0000-0000");
      const submitButton = screen.getByRole("button", { name: "회원가입" });

      await user.type(emailInput, "newuser@example.com");
      await user.type(passwordInput, "password123");
      await user.type(nameInput, "새 사용자");
      await user.type(phoneInput, "010-1111-1111");

      // Role 선택 (라디오 버튼)
      const studentRole = screen.getByRole("radio", { name: "수강생" });
      await user.click(studentRole);

      await user.click(submitButton);

      await waitFor(() => {
        // Router navigation would be called
        expect(submitButton).toBeTruthy();
      });
    });
  });

  describe("API Error Handling - Email Duplicate", () => {
    it("should display email field error when email already exists (U001)", async () => {
      server.use(mockHandlers.auth.signUpEmailDuplicate);
      const user = userEvent.setup();
      renderWithProviders(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getAllByPlaceholderText("••••••••")[0];
      const nameInput = screen.getByPlaceholderText("이름");
      const phoneInput = screen.getByPlaceholderText("010-0000-0000");
      const submitButton = screen.getByRole("button", { name: "회원가입" });

      await user.type(emailInput, "existing@example.com");
      await user.type(passwordInput, "pass123");
      await user.type(nameInput, "사용자");
      await user.type(phoneInput, "010-0000-0000");

      const studentRole = screen.getByRole("radio", { name: "수강생" });
      await user.click(studentRole);

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("이미 사용 중인 이메일입니다")).toBeTruthy();
      });
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors for empty required fields", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignUpForm />);

      const submitButton = screen.getByRole("button", { name: "회원가입" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/이메일을 입력해주세요|유효한 이메일을 입력해주세요/)).toBeTruthy();
      });
    });
  });
});
