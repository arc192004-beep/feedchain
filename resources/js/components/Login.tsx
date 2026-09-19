import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Fish,
    Waves,
    LockKeyhole,
} from "lucide-react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [flashMessage, setFlashMessage] = useState<string | null>(null);

    const loginForm = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submitLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setFlashMessage(null);

        loginForm.post(route("login"), {
            onError: (errs) => {
                const first = errs && Object.values(errs)[0];

                if (first) {
                    setFlashMessage(String(first));
                }
            },
        });
    };

    return (
        <div
            style={{ fontFamily: "Tahoma, sans-serif" }}
            className="
                min-h-screen
                bg-slate-100
                flex
                items-center
                justify-center
                p-3
                sm:p-5
                overflow-hidden
            "
        >
            <div
                className="
                    relative
                    w-full
                    max-w-[1080px]
                    min-h-[620px]
                    overflow-hidden
                    rounded-[28px]
                    bg-white
                    border
                    border-white
                    shadow-[0_30px_80px_rgba(8,47,73,0.20)]
                    flex
                    flex-col
                    md:flex-row
                "
            >
                {/* =========================================================
                    LEFT AQUATIC BRANDING PANEL
                ========================================================== */}
                <div
                    className="
                        relative
                        hidden
                        md:flex
                        md:w-[53%]
                        overflow-hidden
                        flex-col
                        items-center
                        justify-center
                        px-10
                        py-12
                        text-center
                        bg-gradient-to-br
                        from-[#075985]
                        via-[#0891B2]
                        to-[#06B6D4]
                    "
                >
                    {/* Background glow */}
                    <div
                        className="
                            absolute
                            -top-40
                            -right-40
                            w-[480px]
                            h-[480px]
                            rounded-full
                            bg-cyan-200/20
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-48
                            -left-40
                            w-[520px]
                            h-[520px]
                            rounded-full
                            bg-blue-300/20
                            blur-3xl
                        "
                    />

                    {/* =====================================================
                        FLOATING BUBBLES
                    ====================================================== */}
                    <span className="bubble bubble-1" />
                    <span className="bubble bubble-2" />
                    <span className="bubble bubble-3" />
                    <span className="bubble bubble-4" />
                    <span className="bubble bubble-5" />
                    <span className="bubble bubble-6" />
                    <span className="bubble bubble-7" />
                    <span className="bubble bubble-8" />
                    <span className="bubble bubble-9" />
                    <span className="bubble bubble-10" />
                    <span className="bubble bubble-11" />
                    <span className="bubble bubble-12" />

                    {/* =====================================================
                        BACKGROUND FISH
                    ====================================================== */}
                    <Fish className="fish fish-1" />
                    <Fish className="fish fish-2" />
                    <Fish className="fish fish-3" />
                    <Fish className="fish fish-4" />
                    <Fish className="fish fish-5" />
                    <Fish className="fish fish-6" />
                    <Fish className="fish fish-7" />
                    <Fish className="fish fish-8" />
                    <Fish className="fish fish-9" />
                    <Fish className="fish fish-10" />

                    {/* Small school fish */}
                    <Fish className="small-fish small-fish-1" />
                    <Fish className="small-fish small-fish-2" />
                    <Fish className="small-fish small-fish-3" />
                    <Fish className="small-fish small-fish-4" />
                    <Fish className="small-fish small-fish-5" />
                    <Fish className="small-fish small-fish-6" />

                    {/* =====================================================
                        FEEDING FISH #1
                    ====================================================== */}
                    <div className="feeding-scene feeding-scene-1">
                        <Fish className="feeding-fish feeding-fish-1" />

                        <span className="feeding-eat-ring" />
                        <span className="feeding-bubble feeding-bubble-1" />
                        <span className="feeding-bubble feeding-bubble-2" />
                        <span className="feeding-particle feeding-particle-1" />
                        <span className="feeding-particle feeding-particle-2" />
                    </div>

                    {/* =====================================================
                        FEEDING FISH #2
                    ====================================================== */}
                    <div className="feeding-scene feeding-scene-2">
                        <Fish className="feeding-fish feeding-fish-2" />

                        <span className="feeding-eat-ring" />
                        <span className="feeding-bubble feeding-bubble-1" />
                        <span className="feeding-bubble feeding-bubble-2" />
                        <span className="feeding-particle feeding-particle-1" />
                        <span className="feeding-particle feeding-particle-2" />
                    </div>

                    {/* =====================================================
                        FEEDING FISH #3
                    ====================================================== */}
                    <div className="feeding-scene feeding-scene-3">
                        <Fish className="feeding-fish feeding-fish-3" />

                        <span className="feeding-eat-ring" />
                        <span className="feeding-bubble feeding-bubble-1" />
                        <span className="feeding-bubble feeding-bubble-2" />
                        <span className="feeding-particle feeding-particle-1" />
                        <span className="feeding-particle feeding-particle-2" />
                    </div>

                    {/* =====================================================
                        FEEDING FISH #4
                    ====================================================== */}
                    <div className="feeding-scene feeding-scene-4">
                        <Fish className="feeding-fish feeding-fish-4" />

                        <span className="feeding-eat-ring" />
                        <span className="feeding-bubble feeding-bubble-1" />
                        <span className="feeding-bubble feeding-bubble-2" />
                        <span className="feeding-particle feeding-particle-1" />
                        <span className="feeding-particle feeding-particle-2" />
                    </div>

                    {/* =====================================================
                        FEED GROUP #1
                    ====================================================== */}
                    <div className="feed-group feed-group-1">
                        <span className="feed pellet-1" />
                        <span className="feed pellet-2" />
                        <span className="feed pellet-3" />
                        <span className="feed pellet-4" />
                    </div>

                    {/* =====================================================
                        FEED GROUP #2
                    ====================================================== */}
                    <div className="feed-group feed-group-2">
                        <span className="feed pellet-5" />
                        <span className="feed pellet-6" />
                        <span className="feed pellet-7" />
                        <span className="feed pellet-8" />
                    </div>

                    {/* =====================================================
                        FEED GROUP #3
                    ====================================================== */}
                    <div className="feed-group feed-group-3">
                        <span className="feed pellet-9" />
                        <span className="feed pellet-10" />
                        <span className="feed pellet-11" />
                        <span className="feed pellet-12" />
                    </div>

                    {/* =====================================================
                        FEED GROUP #4
                    ====================================================== */}
                    <div className="feed-group feed-group-4">
                        <span className="feed pellet-13" />
                        <span className="feed pellet-14" />
                        <span className="feed pellet-15" />
                        <span className="feed pellet-16" />
                    </div>
        

                    {/* =====================================================
                        HIGHLIGHTED FEEDCHAIN LOGO
                    ====================================================== */}
                    <div className="relative z-20 flex flex-col items-center">
                        <div className="relative flex items-center justify-center mb-7">
                            <div
                                className="
                                    absolute
                                    w-[250px]
                                    h-[250px]
                                    rounded-full
                                    bg-cyan-100/30
                                    blur-3xl
                                    logo-glow
                                "
                            />

                            <div
                                className="
                                    absolute
                                    w-[215px]
                                    h-[215px]
                                    rounded-full
                                    border
                                    border-white/30
                                    logo-ring
                                "
                            />

                            <div
                                className="
                                    absolute
                                    w-[190px]
                                    h-[190px]
                                    rounded-full
                                    border
                                    border-dashed
                                    border-cyan-100/30
                                    logo-ring-reverse
                                "
                            />

                            <div
                                className="
                                    relative
                                    w-[170px]
                                    h-[170px]
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    bg-white/10
                                    backdrop-blur-md
                                    border
                                    border-white/40
                                    shadow-[0_0_55px_rgba(255,255,255,0.28)]
                                    logo-float
                                "
                            >
                                <div
                                    className="
                                        absolute
                                        inset-3
                                        rounded-full
                                        bg-white/10
                                        blur-md
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        inset-5
                                        rounded-full
                                        border
                                        border-white/10
                                    "
                                />

                                <img
                                    src="/images/feedchain-logo.png"
                                    alt="FEEDCHAIN logo"
                                    className="
                                        relative
                                        z-10
                                        w-[135px]
                                        h-[135px]
                                        object-contain
                                        drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]
                                    "
                                />

                                <span className="logo-bubble logo-bubble-1" />
                                <span className="logo-bubble logo-bubble-2" />
                                <span className="logo-bubble logo-bubble-3" />
                            </div>
                        </div>

                        <h1
                            className="
                                text-4xl
                                lg:text-5xl
                                font-black
                                tracking-[0.14em]
                                text-white
                                drop-shadow-lg
                            "
                        >
                            FEEDCHAIN
                        </h1>

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                mt-2
                                mb-5
                            "
                        >
                            <span className="h-px w-8 bg-white/40" />

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    tracking-[0.25em]
                                    text-cyan-50
                                    uppercase
                                "
                            >
                                Aquatic Feed Management
                            </span>

                            <span className="h-px w-8 bg-white/40" />
                        </div>

                        <p
                            className="
                                max-w-[430px]
                                text-sm
                                lg:text-[15px]
                                leading-7
                                text-cyan-50/90
                            "
                        >
                            Integrated management for aquatic feed production,
                            inventory, distribution, sales, and data-driven
                            decision support.
                        </p>

                    </div>
                </div>

                {/* =========================================================
                    RIGHT LOGIN PANEL
                ========================================================== */}
                <div
                    className="
                        relative
                        w-full
                        md:w-[47%]
                        flex
                        items-center
                        justify-center
                        bg-white
                        px-6
                        sm:px-10
                        lg:px-14
                        py-9
                    "
                >
                    {/* Mobile background */}
                    <div
                        className="
                            md:hidden
                            absolute
                            -top-32
                            -right-32
                            w-72
                            h-72
                            rounded-full
                            bg-cyan-100
                            blur-3xl
                        "
                    />

                    <div className="relative z-10 w-full max-w-[390px]">
                        {/* Mobile logo */}
                        <div className="md:hidden text-center mb-7">
                            <div className="relative w-28 h-28 mx-auto mb-4">
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        rounded-full
                                        bg-cyan-100
                                        blur-xl
                                    "
                                />

                                <div
                                    className="
                                        relative
                                        w-full
                                        h-full
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        bg-gradient-to-br
                                        from-cyan-50
                                        to-blue-50
                                        border
                                        border-cyan-100
                                        shadow-xl
                                    "
                                >
                                    <img
                                        src="/images/feedchain-logo.png"
                                        alt="FEEDCHAIN logo"
                                        className="
                                            w-20
                                            h-20
                                            object-contain
                                            drop-shadow-md
                                        "
                                    />
                                </div>
                            </div>

                            <h1
                                className="
                                    text-2xl
                                    font-black
                                    tracking-[0.15em]
                                    text-slate-900
                                "
                            >
                                FEEDCHAIN
                            </h1>

                            <p
                                className="
                                    text-[10px]
                                    text-cyan-700
                                    font-bold
                                    tracking-[0.15em]
                                    mt-1
                                "
                            >
                                AQUATIC FEED MANAGEMENT
                            </p>
                        </div>

                        {/* Login heading */}
                        <div className="mb-7">
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-cyan-50
                                        text-cyan-600
                                    "
                                >
                                    <LockKeyhole size={20} />
                                </div>

                                <div>
                                    <h2
                                        className="
                                            text-2xl
                                            sm:text-3xl
                                            font-black
                                            text-slate-900
                                        "
                                    >
                                        Sign in
                                    </h2>

                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Access your FeedChain account
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error message */}
                        {flashMessage && (
                            <div
                                className="
                                    mb-5
                                    p-3.5
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    text-red-700
                                    text-sm
                                    font-medium
                                "
                            >
                                {flashMessage}
                            </div>
                        )}

                        <form
                            onSubmit={submitLogin}
                            className="space-y-5"
                        >
                            {/* Username / Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="
                                        block
                                        text-xs
                                        font-bold
                                        text-slate-700
                                        uppercase
                                        tracking-wide
                                        mb-2
                                    "
                                >
                                    Username or Email
                                </label>

                                <input
                                    id="email"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Enter your username or email"
                                    value={loginForm.data.email}
                                    onChange={(e) =>
                                        loginForm.setData(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="
                                        w-full
                                        h-12
                                        px-4
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-sm
                                        text-slate-900
                                        placeholder:text-slate-400
                                        outline-none
                                        transition-all
                                        duration-200
                                        focus:bg-white
                                        focus:border-cyan-500
                                        focus:ring-4
                                        focus:ring-cyan-100
                                    "
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label
                                        htmlFor="password"
                                        className="
                                            block
                                            text-xs
                                            font-bold
                                            text-slate-700
                                            uppercase
                                            tracking-wide
                                        "
                                    >
                                        Password
                                    </label>

                                    <a
                                        href={route("password.request")}
                                        className="
                                            text-xs
                                            font-semibold
                                            text-cyan-600
                                            hover:text-cyan-700
                                        "
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={loginForm.data.password}
                                        onChange={(e) =>
                                            loginForm.setData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        required
                                        className="
                                            w-full
                                            h-12
                                            pl-4
                                            pr-12
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            text-sm
                                            text-slate-900
                                            placeholder:text-slate-400
                                            outline-none
                                            transition-all
                                            duration-200
                                            focus:bg-white
                                            focus:border-cyan-500
                                            focus:ring-4
                                            focus:ring-cyan-100
                                        "
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            flex
                                            items-center
                                            justify-center
                                            w-8
                                            h-8
                                            rounded-lg
                                            text-slate-400
                                            hover:text-cyan-600
                                            hover:bg-cyan-50
                                        "
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center">
                                <label
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-slate-600
                                        cursor-pointer
                                    "
                                >
                                    <input
                                        type="checkbox"
                                        checked={Boolean(
                                            loginForm.data.remember
                                        )}
                                        onChange={(e) =>
                                            loginForm.setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="
                                            w-4
                                            h-4
                                            rounded
                                            border-slate-300
                                            text-cyan-600
                                            focus:ring-cyan-500
                                        "
                                    />

                                    Remember me
                                </label>
                            </div>

                            {/* Sign in */}
                            <button
                                type="submit"
                                disabled={loginForm.processing}
                                className="
                                    group
                                    relative
                                    w-full
                                    h-12
                                    overflow-hidden
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-[#0891B2]
                                    via-[#06B6D4]
                                    to-[#2563EB]
                                    text-white
                                    text-sm
                                    font-bold
                                    shadow-lg
                                    shadow-cyan-200
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:shadow-xl
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                "
                            >
                                <span
                                    className="
                                        absolute
                                        inset-0
                                        -translate-x-full
                                        group-hover:translate-x-full
                                        transition-transform
                                        duration-700
                                        bg-gradient-to-r
                                        from-transparent
                                        via-white/20
                                        to-transparent
                                    "
                                />

                                <span className="relative flex items-center justify-center gap-2">
                                    {loginForm.processing
                                        ? "Signing in..."
                                        : "Sign In"}

                                    {!loginForm.processing && (
                                        <ArrowRight
                                            size={18}
                                            className="
                                                transition-transform
                                                duration-300
                                                group-hover:translate-x-1
                                            "
                                        />
                                    )}
                                </span>
                            </button>

                            {/* Divider */}
                            <div className="relative py-1">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>

                                <div className="relative flex justify-center">
                                    <span
                                        className="
                                            px-3
                                            bg-white
                                            text-[11px]
                                            text-slate-400
                                            uppercase
                                            tracking-wider
                                        "
                                    >
                                        or
                                    </span>
                                </div>
                            </div>

                            {/* Another account */}
                            <button
                                type="button"
                                onClick={() =>
                                    (window.location.href = route("login"))
                                }
                                className="
                                    w-full
                                    h-11
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-600
                                    text-xs
                                    font-semibold
                                    hover:bg-slate-50
                                    hover:border-cyan-200
                                    hover:text-cyan-700
                                    transition-all
                                "
                            >
                                Sign in with another account
                            </button>
                        </form>

                        {/* Security */}
                        <div
                            className="
                                mt-6
                                flex
                                items-center
                                justify-center
                                gap-2
                                text-[10px]
                                text-slate-400
                            "
                        >
                            <ShieldCheck
                                size={13}
                                className="text-cyan-500"
                            />

                            <span>
                                Protected access for authorized system users
                            </span>
                        </div>

                        {/* Footer */}
                        <div className="mt-5 text-center">
                            <p className="text-[10px] text-slate-400">
                                © 2026 3H Enterprises Ltd., Inc. All rights
                                reserved.
                            </p>

                            <p className="mt-1 text-[10px] text-slate-300">
                                FeedChain Aquatic Feed Management System
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* =============================================================
                ANIMATION CSS
            ============================================================= */}

            <style>{`

                /* =========================================================
                   LOGO
                ========================================================== */

                @keyframes logoFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-9px);
                    }
                }

                @keyframes logoGlow {
                    0%, 100% {
                        opacity: .3;
                        transform: scale(.94);
                    }

                    50% {
                        opacity: .7;
                        transform: scale(1.08);
                    }
                }

                @keyframes logoRing {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes logoRingReverse {
                    from {
                        transform: rotate(360deg);
                    }

                    to {
                        transform: rotate(0deg);
                    }
                }

                .logo-float {
                    animation: logoFloat 4s ease-in-out infinite;
                }

                .logo-glow {
                    animation: logoGlow 3.5s ease-in-out infinite;
                }

                .logo-ring {
                    animation: logoRing 15s linear infinite;
                }

                .logo-ring-reverse {
                    animation: logoRingReverse 20s linear infinite;
                }

                /* =========================================================
                   BUBBLES
                ========================================================== */

                @keyframes bubbleRise {
                    0% {
                        transform:
                            translateY(30px)
                            scale(.5);
                        opacity: 0;
                    }

                    15% {
                        opacity: .7;
                    }

                    80% {
                        opacity: .35;
                    }

                    100% {
                        transform:
                            translateY(-450px)
                            scale(1.2);
                        opacity: 0;
                    }
                }

                .bubble {
                    position: absolute;
                    bottom: -25px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,.45);
                    background: rgba(255,255,255,.08);
                    animation: bubbleRise linear infinite;
                    pointer-events: none;
                    z-index: 3;
                }

                .bubble-1 {
                    left: 5%;
                    width: 10px;
                    height: 10px;
                    animation-duration: 9s;
                }

                .bubble-2 {
                    left: 13%;
                    width: 6px;
                    height: 6px;
                    animation-duration: 12s;
                    animation-delay: 1s;
                }

                .bubble-3 {
                    left: 22%;
                    width: 14px;
                    height: 14px;
                    animation-duration: 11s;
                    animation-delay: 4s;
                }

                .bubble-4 {
                    left: 31%;
                    width: 8px;
                    height: 8px;
                    animation-duration: 13s;
                    animation-delay: 2s;
                }

                .bubble-5 {
                    left: 40%;
                    width: 12px;
                    height: 12px;
                    animation-duration: 10s;
                    animation-delay: 5s;
                }

                .bubble-6 {
                    left: 49%;
                    width: 7px;
                    height: 7px;
                    animation-duration: 15s;
                    animation-delay: 1s;
                }

                .bubble-7 {
                    left: 58%;
                    width: 15px;
                    height: 15px;
                    animation-duration: 12s;
                    animation-delay: 4s;
                }

                .bubble-8 {
                    left: 66%;
                    width: 6px;
                    height: 6px;
                    animation-duration: 9s;
                    animation-delay: 6s;
                }

                .bubble-9 {
                    left: 74%;
                    width: 11px;
                    height: 11px;
                    animation-duration: 14s;
                    animation-delay: 2s;
                }

                .bubble-10 {
                    left: 81%;
                    width: 7px;
                    height: 7px;
                    animation-duration: 11s;
                    animation-delay: 7s;
                }

                .bubble-11 {
                    left: 89%;
                    width: 13px;
                    height: 13px;
                    animation-duration: 13s;
                    animation-delay: 3s;
                }

                .bubble-12 {
                    left: 96%;
                    width: 6px;
                    height: 6px;
                    animation-duration: 10s;
                    animation-delay: 5s;
                }

                /* =========================================================
                   BACKGROUND FISH
                ========================================================== */

                @keyframes fishAcross {
                    0% {
                        transform:
                            translateX(-120px)
                            translateY(0)
                            scale(.7);
                        opacity: 0;
                    }

                    10% {
                        opacity: .32;
                    }

                    50% {
                        transform:
                            translateX(420px)
                            translateY(-30px)
                            scale(1);
                        opacity: .45;
                    }

                    90% {
                        opacity: .15;
                    }

                    100% {
                        transform:
                            translateX(850px)
                            translateY(20px)
                            scale(.7);
                        opacity: 0;
                    }
                }

                @keyframes fishAcrossReverse {
                    0% {
                        transform:
                            translateX(850px)
                            translateY(20px)
                            scaleX(-1)
                            scale(.7);
                        opacity: 0;
                    }

                    10% {
                        opacity: .3;
                    }

                    50% {
                        transform:
                            translateX(350px)
                            translateY(-25px)
                            scaleX(-1)
                            scale(1);
                        opacity: .42;
                    }

                    90% {
                        opacity: .15;
                    }

                    100% {
                        transform:
                            translateX(-120px)
                            translateY(25px)
                            scaleX(-1)
                            scale(.7);
                        opacity: 0;
                    }
                }

                .fish {
                    position: absolute;
                    color: rgba(255,255,255,.42);
                    pointer-events: none;
                    z-index: 4;
                }

                .fish-1 {
                    width: 30px;
                    height: 30px;
                    top: 9%;
                    left: -60px;
                    animation: fishAcross 14s linear infinite;
                }

                .fish-2 {
                    width: 22px;
                    height: 22px;
                    top: 17%;
                    right: -60px;
                    animation: fishAcrossReverse 17s linear infinite;
                    animation-delay: 2s;
                }

                .fish-3 {
                    width: 27px;
                    height: 27px;
                    top: 27%;
                    left: -60px;
                    animation: fishAcross 18s linear infinite;
                    animation-delay: 4s;
                }

                .fish-4 {
                    width: 19px;
                    height: 19px;
                    top: 41%;
                    right: -60px;
                    animation: fishAcrossReverse 15s linear infinite;
                    animation-delay: 1s;
                }

                .fish-5 {
                    width: 32px;
                    height: 32px;
                    top: 52%;
                    left: -60px;
                    animation: fishAcross 16s linear infinite;
                    animation-delay: 6s;
                }

                .fish-6 {
                    width: 21px;
                    height: 21px;
                    top: 63%;
                    right: -60px;
                    animation: fishAcrossReverse 19s linear infinite;
                    animation-delay: 3s;
                }

                .fish-7 {
                    width: 28px;
                    height: 28px;
                    top: 73%;
                    left: -60px;
                    animation: fishAcross 15s linear infinite;
                    animation-delay: 5s;
                }

                .fish-8 {
                    width: 18px;
                    height: 18px;
                    top: 81%;
                    right: -60px;
                    animation: fishAcrossReverse 14s linear infinite;
                    animation-delay: 8s;
                }

                .fish-9 {
                    width: 23px;
                    height: 23px;
                    top: 89%;
                    left: -60px;
                    animation: fishAcross 20s linear infinite;
                    animation-delay: 3s;
                }

                .fish-10 {
                    width: 17px;
                    height: 17px;
                    top: 34%;
                    left: -60px;
                    animation: fishAcross 22s linear infinite;
                    animation-delay: 10s;
                }

                /* =========================================================
                   SMALL SCHOOL FISH
                ========================================================== */

                .small-fish {
                    position: absolute;
                    color: rgba(255,255,255,.27);
                    z-index: 4;
                }

                .small-fish-1 {
                    width: 12px;
                    height: 12px;
                    top: 23%;
                    left: 13%;
                    animation: smallFishMove 8s ease-in-out infinite;
                }

                .small-fish-2 {
                    width: 14px;
                    height: 14px;
                    top: 47%;
                    right: 15%;
                    animation: smallFishMove 10s ease-in-out infinite;
                    animation-delay: 2s;
                }

                .small-fish-3 {
                    width: 10px;
                    height: 10px;
                    top: 67%;
                    left: 18%;
                    animation: smallFishMove 7s ease-in-out infinite;
                    animation-delay: 1s;
                }

                .small-fish-4 {
                    width: 13px;
                    height: 13px;
                    top: 77%;
                    right: 12%;
                    animation: smallFishMove 9s ease-in-out infinite;
                    animation-delay: 3s;
                }

                .small-fish-5 {
                    width: 9px;
                    height: 9px;
                    top: 58%;
                    left: 78%;
                    animation: smallFishMove 8s ease-in-out infinite;
                    animation-delay: 4s;
                }

                .small-fish-6 {
                    width: 11px;
                    height: 11px;
                    top: 13%;
                    left: 72%;
                    animation: smallFishMove 11s ease-in-out infinite;
                    animation-delay: 2s;
                }

                @keyframes smallFishMove {
                    0%, 100% {
                        transform:
                            translateX(0)
                            translateY(0);
                    }

                    50% {
                        transform:
                            translateX(70px)
                            translateY(-20px);
                    }
                }

                /* =========================================================
                   FEED GROUPS
                ========================================================== */

                .feed-group {
                    position: absolute;
                    inset: 0;
                    z-index: 14;
                    pointer-events: none;
                }

                .feed {
                    position: absolute;
                    top: -20px;
                    border-radius: 50%;
                    background:
                        radial-gradient(
                            circle at 30% 25%,
                            #fff1c4,
                            #d6a85b 60%,
                            #956329
                        );
                    border: 1px solid rgba(100,60,15,.4);
                    box-shadow:
                        0 2px 4px rgba(0,0,0,.22),
                        0 0 7px rgba(255,220,130,.45);
                }

                /*
                    Every group has its own vertical path.

                    Fish 1 eats around 31%.
                    Fish 2 eats around 46%.
                    Fish 3 eats around 61%.
                    Fish 4 eats around 76%.

                    The pellets scale to ZERO at the same point
                    the fish reaches them.
                */

                @keyframes feedEat1 {
                    0% {
                        transform:
                            translateY(-20px)
                            rotate(0deg)
                            scale(.5);
                        opacity: 0;
                    }

                    8% {
                        opacity: 1;
                    }

                    38% {
                        transform:
                            translateY(180px)
                            rotate(180deg)
                            scale(1);
                        opacity: 1;
                    }

                    53% {
                        transform:
                            translateY(275px)
                            rotate(330deg)
                            scale(1);
                        opacity: 1;
                    }

                    58% {
                        transform:
                            translateY(302px)
                            rotate(360deg)
                            scale(0);
                        opacity: 0;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                @keyframes feedEat2 {
                    0% {
                        transform:
                            translateY(-20px)
                            rotate(0deg)
                            scale(.5);
                        opacity: 0;
                    }

                    8% {
                        opacity: 1;
                    }

                    42% {
                        transform:
                            translateY(170px)
                            rotate(180deg)
                            scale(1);
                        opacity: 1;
                    }

                    58% {
                        transform:
                            translateY(270px)
                            rotate(330deg)
                            scale(1);
                        opacity: 1;
                    }

                    63% {
                        transform:
                            translateY(298px)
                            rotate(360deg)
                            scale(0);
                        opacity: 0;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                @keyframes feedEat3 {
                    0% {
                        transform:
                            translateY(-20px)
                            rotate(0deg)
                            scale(.5);
                        opacity: 0;
                    }

                    8% {
                        opacity: 1;
                    }

                    45% {
                        transform:
                            translateY(165px)
                            rotate(180deg)
                            scale(1);
                        opacity: 1;
                    }

                    63% {
                        transform:
                            translateY(270px)
                            rotate(330deg)
                            scale(1);
                        opacity: 1;
                    }

                    68% {
                        transform:
                            translateY(300px)
                            rotate(360deg)
                            scale(0);
                        opacity: 0;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                @keyframes feedEat4 {
                    0% {
                        transform:
                            translateY(-20px)
                            rotate(0deg)
                            scale(.5);
                        opacity: 0;
                    }

                    8% {
                        opacity: 1;
                    }

                    47% {
                        transform:
                            translateY(170px)
                            rotate(180deg)
                            scale(1);
                        opacity: 1;
                    }

                    68% {
                        transform:
                            translateY(275px)
                            rotate(330deg)
                            scale(1);
                        opacity: 1;
                    }

                    73% {
                        transform:
                            translateY(303px)
                            rotate(360deg)
                            scale(0);
                        opacity: 0;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                /* GROUP 1 */
                .feed-group-1 .pellet-1 {
                    left: 17%;
                    width: 8px;
                    height: 8px;
                    animation: feedEat1 8s linear infinite;
                }

                .feed-group-1 .pellet-2 {
                    left: 19%;
                    width: 6px;
                    height: 6px;
                    animation: feedEat1 8s linear infinite;
                    animation-delay: 1.1s;
                }

                .feed-group-1 .pellet-3 {
                    left: 21%;
                    width: 9px;
                    height: 9px;
                    animation: feedEat1 8s linear infinite;
                    animation-delay: 2.2s;
                }

                .feed-group-1 .pellet-4 {
                    left: 23%;
                    width: 5px;
                    height: 5px;
                    animation: feedEat1 8s linear infinite;
                    animation-delay: 3.3s;
                }

                /* GROUP 2 */
                .feed-group-2 .pellet-5 {
                    left: 38%;
                    width: 7px;
                    height: 7px;
                    animation: feedEat2 8s linear infinite;
                    animation-delay: 2s;
                }

                .feed-group-2 .pellet-6 {
                    left: 40%;
                    width: 5px;
                    height: 5px;
                    animation: feedEat2 8s linear infinite;
                    animation-delay: 3.1s;
                }

                .feed-group-2 .pellet-7 {
                    left: 42%;
                    width: 9px;
                    height: 9px;
                    animation: feedEat2 8s linear infinite;
                    animation-delay: 4.2s;
                }

                .feed-group-2 .pellet-8 {
                    left: 44%;
                    width: 6px;
                    height: 6px;
                    animation: feedEat2 8s linear infinite;
                    animation-delay: 5.3s;
                }

                /* GROUP 3 */
                .feed-group-3 .pellet-9 {
                    left: 59%;
                    width: 8px;
                    height: 8px;
                    animation: feedEat3 8s linear infinite;
                    animation-delay: 4s;
                }

                .feed-group-3 .pellet-10 {
                    left: 61%;
                    width: 6px;
                    height: 6px;
                    animation: feedEat3 8s linear infinite;
                    animation-delay: 5.1s;
                }

                .feed-group-3 .pellet-11 {
                    left: 63%;
                    width: 9px;
                    height: 9px;
                    animation: feedEat3 8s linear infinite;
                    animation-delay: 6.2s;
                }

                .feed-group-3 .pellet-12 {
                    left: 65%;
                    width: 5px;
                    height: 5px;
                    animation: feedEat3 8s linear infinite;
                    animation-delay: 7.3s;
                }

                /* GROUP 4 */
                .feed-group-4 .pellet-13 {
                    left: 76%;
                    width: 8px;
                    height: 8px;
                    animation: feedEat4 8s linear infinite;
                    animation-delay: 6s;
                }

                .feed-group-4 .pellet-14 {
                    left: 78%;
                    width: 5px;
                    height: 5px;
                    animation: feedEat4 8s linear infinite;
                    animation-delay: 7.1s;
                }

                .feed-group-4 .pellet-15 {
                    left: 80%;
                    width: 9px;
                    height: 9px;
                    animation: feedEat4 8s linear infinite;
                    animation-delay: 8.2s;
                }

                .feed-group-4 .pellet-16 {
                    left: 82%;
                    width: 6px;
                    height: 6px;
                    animation: feedEat4 8s linear infinite;
                    animation-delay: 9.3s;
                }

                /* =========================================================
                   FOUR FEEDING FISH
                ========================================================== */

                .feeding-scene {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    pointer-events: none;
                    z-index: 16;
                }

                /*
                    Fish 1 feeds on the LEFT
                */

                .feeding-scene-1 {
                    top: 23%;
                }

                /*
                    Fish 2 feeds slightly LEFT-CENTER
                */

                .feeding-scene-2 {
                    top: 38%;
                }

                /*
                    Fish 3 feeds slightly RIGHT-CENTER
                */

                .feeding-scene-3 {
                    top: 53%;
                }

                /*
                    Fish 4 feeds on the RIGHT
                */

                .feeding-scene-4 {
                    top: 67%;
                }

                @keyframes feedingFish1 {
                    0% {
                        transform:
                            translateX(-100px)
                            translateY(10px)
                            scale(.65);
                        opacity: 0;
                    }

                    10% {
                        opacity: .8;
                    }

                    27% {
                        transform:
                            translateX(80px)
                            translateY(-5px)
                            scale(.9);
                    }

                    43% {
                        transform:
                            translateX(145px)
                            translateY(8px)
                            scale(1);
                    }

                    54% {
                        transform:
                            translateX(175px)
                            translateY(5px)
                            scale(1.08);
                    }

                    /*
                        BITE
                    */
                    59% {
                        transform:
                            translateX(185px)
                            translateY(5px)
                            scale(1.2);
                    }

                    64% {
                        transform:
                            translateX(190px)
                            translateY(5px)
                            scale(1.05);
                    }

                    78% {
                        transform:
                            translateX(370px)
                            translateY(-15px)
                            scale(.85);
                        opacity: .55;
                    }

                    94% {
                        transform:
                            translateX(600px)
                            translateY(10px)
                            scale(.65);
                        opacity: .1;
                    }

                    100% {
                        transform:
                            translateX(750px)
                            scale(.55);
                        opacity: 0;
                    }
                }

                @keyframes feedingFish2 {
                    0% {
                        transform:
                            translateX(850px)
                            translateY(15px)
                            scaleX(-1)
                            scale(.65);
                        opacity: 0;
                    }

                    10% {
                        opacity: .8;
                    }

                    28% {
                        transform:
                            translateX(610px)
                            translateY(-8px)
                            scaleX(-1)
                            scale(.9);
                    }

                    45% {
                        transform:
                            translateX(520px)
                            translateY(5px)
                            scaleX(-1)
                            scale(1);
                    }

                    55% {
                        transform:
                            translateX(490px)
                            translateY(3px)
                            scaleX(-1)
                            scale(1.08);
                    }

                    60% {
                        transform:
                            translateX(480px)
                            translateY(3px)
                            scaleX(-1)
                            scale(1.2);
                    }

                    65% {
                        transform:
                            translateX(475px)
                            translateY(3px)
                            scaleX(-1)
                            scale(1.05);
                    }

                    80% {
                        transform:
                            translateX(280px)
                            translateY(-18px)
                            scaleX(-1)
                            scale(.85);
                        opacity: .55;
                    }

                    95% {
                        transform:
                            translateX(30px)
                            translateY(10px)
                            scaleX(-1)
                            scale(.65);
                        opacity: .1;
                    }

                    100% {
                        transform:
                            translateX(-100px)
                            scaleX(-1)
                            scale(.55);
                        opacity: 0;
                    }
                }

                @keyframes feedingFish3 {
                    0% {
                        transform:
                            translateX(-120px)
                            translateY(20px)
                            scale(.65);
                        opacity: 0;
                    }

                    10% {
                        opacity: .8;
                    }

                    27% {
                        transform:
                            translateX(180px)
                            translateY(-5px)
                            scale(.9);
                    }

                    43% {
                        transform:
                            translateX(300px)
                            translateY(8px)
                            scale(1);
                    }

                    55% {
                        transform:
                            translateX(340px)
                            translateY(5px)
                            scale(1.08);
                    }

                    61% {
                        transform:
                            translateX(350px)
                            translateY(5px)
                            scale(1.2);
                    }

                    66% {
                        transform:
                            translateX(355px)
                            translateY(5px)
                            scale(1.05);
                    }

                    80% {
                        transform:
                            translateX(550px)
                            translateY(-15px)
                            scale(.85);
                        opacity: .55;
                    }

                    95% {
                        transform:
                            translateX(760px)
                            translateY(10px)
                            scale(.65);
                        opacity: .1;
                    }

                    100% {
                        transform:
                            translateX(900px)
                            scale(.55);
                        opacity: 0;
                    }
                }

                @keyframes feedingFish4 {
                    0% {
                        transform:
                            translateX(900px)
                            translateY(10px)
                            scaleX(-1)
                            scale(.65);
                        opacity: 0;
                    }

                    10% {
                        opacity: .8;
                    }

                    28% {
                        transform:
                            translateX(690px)
                            translateY(-5px)
                            scaleX(-1)
                            scale(.9);
                    }

                    44% {
                        transform:
                            translateX(610px)
                            translateY(8px)
                            scaleX(-1)
                            scale(1);
                    }

                    55% {
                        transform:
                            translateX(575px)
                            translateY(5px)
                            scaleX(-1)
                            scale(1.08);
                    }

                    61% {
                        transform:
                            translateX(565px)
                            translateY(5px)
                            scaleX(-1)
                            scale(1.2);
                    }

                    66% {
                        transform:
                            translateX(560px)
                            translateY(5px)
                            scaleX(-1)
                            scale(1.05);
                    }

                    81% {
                        transform:
                            translateX(350px)
                            translateY(-15px)
                            scaleX(-1)
                            scale(.85);
                        opacity: .55;
                    }

                    95% {
                        transform:
                            translateX(100px)
                            translateY(10px)
                            scaleX(-1)
                            scale(.65);
                        opacity: .1;
                    }

                    100% {
                        transform:
                            translateX(-100px)
                            scaleX(-1)
                            scale(.55);
                        opacity: 0;
                    }
                }

                .feeding-fish {
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    color: rgba(255,255,255,.96);
                    filter:
                        drop-shadow(0 4px 7px rgba(0,0,0,.3))
                        drop-shadow(0 0 12px rgba(255,255,255,.25));
                }

                .feeding-fish-1 {
                    left: 0;
                    top: 0;
                    animation:
                        feedingFish1
                        8s
                        ease-in-out
                        infinite;
                }

                .feeding-fish-2 {
                    left: 0;
                    top: 0;
                    animation:
                        feedingFish2
                        8s
                        ease-in-out
                        infinite;
                    animation-delay: 2s;
                }

                .feeding-fish-3 {
                    left: 0;
                    top: 0;
                    animation:
                        feedingFish3
                        8s
                        ease-in-out
                        infinite;
                    animation-delay: 4s;
                }

                .feeding-fish-4 {
                    left: 0;
                    top: 0;
                    animation:
                        feedingFish4
                        8s
                        ease-in-out
                        infinite;
                    animation-delay: 6s;
                }

                /* =========================================================
                   EATING EFFECT
                ========================================================== */

                @keyframes feedingRing {
                    0%,
                    54% {
                        transform: scale(0);
                        opacity: 0;
                    }

                    59% {
                        transform: scale(.5);
                        opacity: .9;
                    }

                    68% {
                        transform: scale(2.5);
                        opacity: 0;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                .feeding-eat-ring {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,.8);
                    top: 22px;
                    left: 185px;
                    animation:
                        feedingRing
                        8s
                        ease-out
                        infinite;
                }

                .feeding-scene-2 .feeding-eat-ring {
                    left: 475px;
                }

                .feeding-scene-3 .feeding-eat-ring {
                    left: 350px;
                }

                .feeding-scene-4 .feeding-eat-ring {
                    left: 560px;
                }

                /* =========================================================
                   EATING BUBBLES
                ========================================================== */

                @keyframes feedingBubble {
                    0%,
                    55% {
                        transform:
                            translate(0,0)
                            scale(0);
                        opacity: 0;
                    }

                    60% {
                        transform:
                            translate(0,0)
                            scale(1);
                        opacity: .85;
                    }

                    78% {
                        transform:
                            translate(-10px,-30px)
                            scale(.6);
                        opacity: 0;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                .feeding-bubble {
                    position: absolute;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,.8);
                    background: rgba(255,255,255,.12);
                    animation:
                        feedingBubble
                        8s
                        ease-out
                        infinite;
                }

                .feeding-bubble-1 {
                    left: 190px;
                    top: 22px;
                }

                .feeding-bubble-2 {
                    left: 198px;
                    top: 28px;
                    width: 5px;
                    height: 5px;
                    animation-delay: .12s;
                }

                .feeding-scene-2 .feeding-bubble-1 {
                    left: 480px;
                }

                .feeding-scene-2 .feeding-bubble-2 {
                    left: 488px;
                }

                .feeding-scene-3 .feeding-bubble-1 {
                    left: 355px;
                }

                .feeding-scene-3 .feeding-bubble-2 {
                    left: 363px;
                }

                .feeding-scene-4 .feeding-bubble-1 {
                    left: 565px;
                }

                .feeding-scene-4 .feeding-bubble-2 {
                    left: 573px;
                }

                /* =========================================================
                   EATING PARTICLES
                ========================================================== */

                @keyframes feedingParticle {
                    0%,
                    55% {
                        transform: scale(0);
                        opacity: 0;
                    }

                    60% {
                        transform: scale(1.3);
                        opacity: 1;
                    }

                    70% {
                        transform:
                            translateY(-16px)
                            translateX(8px)
                            scale(.4);
                        opacity: 0;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                .feeding-particle {
                    position: absolute;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #ffe8ad;
                    box-shadow:
                        0 0 9px #ffe8ad;
                    animation:
                        feedingParticle
                        8s
                        ease-out
                        infinite;
                }

                .feeding-particle-1 {
                    left: 180px;
                    top: 27px;
                }

                .feeding-particle-2 {
                    left: 202px;
                    top: 30px;
                    animation-delay: .1s;
                }

                .feeding-scene-2 .feeding-particle-1 {
                    left: 470px;
                }

                .feeding-scene-2 .feeding-particle-2 {
                    left: 492px;
                }

                .feeding-scene-3 .feeding-particle-1 {
                    left: 340px;
                }

                .feeding-scene-3 .feeding-particle-2 {
                    left: 362px;
                }

                .feeding-scene-4 .feeding-particle-1 {
                    left: 550px;
                }

                .feeding-scene-4 .feeding-particle-2 {
                    left: 572px;
                }

                /* =========================================================
                   LOGO ORBITS
                ========================================================== */

                @keyframes orbitOne {
                    from {
                        transform:
                            rotate(0deg)
                            translateX(86px)
                            rotate(0deg);
                    }

                    to {
                        transform:
                            rotate(360deg)
                            translateX(86px)
                            rotate(-360deg);
                    }
                }

                @keyframes orbitTwo {
                    from {
                        transform:
                            rotate(120deg)
                            translateX(86px)
                            rotate(-120deg);
                    }

                    to {
                        transform:
                            rotate(480deg)
                            translateX(86px)
                            rotate(-480deg);
                    }
                }

                @keyframes orbitThree {
                    from {
                        transform:
                            rotate(240deg)
                            translateX(86px)
                            rotate(-240deg);
                    }

                    to {
                        transform:
                            rotate(600deg)
                            translateX(86px)
                            rotate(-600deg);
                    }
                }

                .logo-bubble {
                    position: absolute;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: rgba(255,255,255,.8);
                    box-shadow:
                        0 0 12px rgba(255,255,255,.8);
                }

                .logo-bubble-1 {
                    animation: orbitOne 8s linear infinite;
                }

                .logo-bubble-2 {
                    animation: orbitTwo 11s linear infinite;
                }

                .logo-bubble-3 {
                    animation: orbitThree 14s linear infinite;
                }

                /* =========================================================
                   REDUCED MOTION
                ========================================================== */

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>
        </div>
    );
}