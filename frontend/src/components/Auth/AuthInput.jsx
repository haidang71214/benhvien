import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function AuthInputFields({ isLogin, formData, onChange, loading, error }) {
  return (
    <>
      {!isLogin && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              name="userName"
              type="text"
              required
              value={formData.userName || ""}
              onChange={onChange}
              disabled={loading}
              className={cn("h-10 text-sm px-3 py-2", error ? "border-destructive ring-destructive" : "border-gray-300")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              required
              value={formData.dob || ""}
              onChange={onChange}
              disabled={loading}
              className={cn("h-10 text-sm px-3 py-2", error ? "border-destructive ring-destructive" : "border-gray-300")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sex">Gender</Label>
            <select
              id="sex"
              name="sex"
              required
              value={formData.sex || ""}
              onChange={onChange}
              disabled={loading}
              className={cn("h-10 text-sm px-3 py-2 border rounded", error ? "border-destructive ring-destructive" : "border-gray-300")}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={onChange}
          disabled={loading}
          className={cn("h-10 text-sm px-3 py-2", error ? "border-destructive ring-destructive" : "border-gray-300")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={onChange}
          disabled={loading}
          className={cn("h-10 text-sm px-3 py-2", error ? "border-destructive ring-destructive" : "border-gray-300")}
        />
      </div>

      {!isLogin && (
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword || ""}
            onChange={onChange}
            disabled={loading}
            className={cn("h-10 text-sm px-3 py-2", error ? "border-destructive ring-destructive" : "border-gray-300")}
          />
        </div>
      )}
    </>
  );
}