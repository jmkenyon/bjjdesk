export const RequiredLabel = ({ children }: { children: string }) => (
    <span>
      {children} <span className="text-red-500">*</span>
    </span>
  );