import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  createContext,
} from "react";
import * as serviceWorker from "./serviceWorker";

const ServiceWorkerContext = createContext();

// https://medium.com/@FezVrasta/service-worker-updates-and-error-handling-with-react-1a3730800e6a
export const ServiceWorkerProvider = ({ children }) => {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    serviceWorker.register({
      onUpdate: (registration) => {
        setWaitingServiceWorker(registration.waiting);
        setUpdateAvailable(true);
      },
      onWaiting: (waiting) => {
        setWaitingServiceWorker(waiting);
        setUpdateAvailable(true);
      },
    });
  }, []);

  useEffect(() => {
    if (waitingServiceWorker) {
      // We setup an event listener to automatically reload the page
      // after the Service Worker has been updated, this will trigger
      // on all the open tabs of our application, so that we don't leave
      // any tab in an incosistent state
      waitingServiceWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
    }
  }, [waitingServiceWorker]);

  const value = useMemo(
    () => ({
      isUpdateAvailable,
      updateAssets: () => {
        if (waitingServiceWorker) {
          // We send the SKIP_WAITING message to tell the Service Worker
          // to update its cache and flush the old one
          waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
        }
      },
    }),
    [isUpdateAvailable, waitingServiceWorker]
  );

  return (
    <ServiceWorkerContext.Provider value={value}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};

// With this React Hook we'll be able to access `isUpdateAvailable` and `updateAssets`
export const useServiceWorker = () => {
  return useContext(ServiceWorkerContext);
};
