import React from "react";
export default function useAsyncError() {
  const [, setError] = React.useState();
  return React.useCallback(
    (e) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
}
