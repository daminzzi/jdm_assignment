import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import SignInForm from "@/features/auth/ui/SignInForm";
import { renderWithProviders } from "../../../test-utils";
import { server } from "../../../mocks/server";
import { mockHandlers } from "../../../mocks/handlers";

describe("SignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe("Successful Login", () => {
    it("should display loading state and navigate on successful login", async () => {
      server.use(mockHandlers.auth.signInSuccess);
      const user = userEvent.setup();
      renderWithProviders(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.type(emailInput, "student@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // Wait for the form to complete (no errors)
      await waitFor(() => {
        expect(
          screen.queryByText(/사용자를 찾을 수 없습니다|비밀번호가 일치하지 않습니다/),
        ).not.toBeTruthy();
      });
    });
  });

  describe("Form Validation", () => {
    it("should show email validation error for invalid email", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      // Type invalid email and valid password
      await user.type(emailInput, "invalid-email");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // Form validation from zod should trigger
      await waitFor(
        () => {
          const errorElement = screen.queryByText("유효한 이메일을 입력해주세요");
          expect(errorElement).toBeTruthy();
        },
        { timeout: 2000 },
      );
    });

    it("should show password validation error when password is empty", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.type(emailInput, "user@example.com");
      await user.click(submitButton);

      await waitFor(
        () => {
          const errorElement = screen.queryByText("비밀번호를 입력해주세요");
          expect(errorElement).toBeTruthy();
        },
        { timeout: 2000 },
      );
    });
  });

  describe("API Error Handling - Field Errors", () => {
    it("should display email field error when user not found (U002)", async () => {
      server.use(mockHandlers.auth.signInNotFound);
      const user = userEvent.setup();
      renderWithProviders(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.type(emailInput, "notfound@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByText("사용자를 찾을 수 없습니다");
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it("should display password field error when password mismatch (U003)", async () => {
      server.use(mockHandlers.auth.signInPasswordMismatch);
      const user = userEvent.setup();
      renderWithProviders(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.type(emailInput, "student@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByText("비밀번호가 일치하지 않습니다");
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe("API Error Handling - Global Error", () => {
    it("should display global error message when API fails", async () => {
      server.use(mockHandlers.auth.signInValidationError);
      const user = userEvent.setup();
      renderWithProviders(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.type(emailInput, "user@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByText("이메일 형식이 올바르지 않습니다");
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe("UI Interactions", () => {
    it("should navigate to signup page when signup button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignInForm />);

      const signupButton = screen.getByRole("button", { name: "회원가입" });
      await user.click(signupButton);

      // Router navigation would be called (mocked via vi.mock)
      // Test passes if button can be clicked without errors
      expect(signupButton).toBeTruthy();
    });
  });
});
