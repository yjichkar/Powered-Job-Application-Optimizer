import { createBrowserRouter } from "react-router";
import { Root } from "@/pages/Root";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { AllServices } from "@/pages/AllServices";
import { Login } from "@/pages/Login";
import { SignUp } from "@/pages/SignUp";
import { ATSScanner } from "@/pages/services/ATSScanner";
import { JobMatch } from "@/pages/services/JobMatch";
import { SkillGap } from "@/pages/services/SkillGap";
import { InterviewPrep } from "@/pages/services/InterviewPrep";
import { CVBuilder } from "@/pages/services/CVBuilder";
import { ColdEmail } from "@/pages/services/ColdEmail";
import { NetworkMap } from "@/pages/services/NetworkMap";
import { ResponseRate } from "@/pages/services/ResponseRate";

export function createRouter(user, onLogout) {
    return createBrowserRouter([
        {
            path: "/",
            element: <Root user={user} onLogout={onLogout} />,
            children: [
                { index: true, element: <Home /> },
                { path: "about", element: <About /> },
                { path: "services", element: <AllServices /> },
                { path: "login", element: <Login /> },
                { path: "signup", element: <SignUp /> },
                { path: "services/ats-scanner", element: <ATSScanner /> },
                { path: "services/job-match", element: <JobMatch /> },
                { path: "services/skill-gap", element: <SkillGap /> },
                { path: "services/interview-prep", element: <InterviewPrep /> },
                { path: "services/cv-builder", element: <CVBuilder /> },
                { path: "services/cold-email", element: <ColdEmail /> },
                { path: "services/network-map", element: <NetworkMap /> },
                { path: "services/response-rate", element: <ResponseRate /> },
            ],
        },
    ]);
}
