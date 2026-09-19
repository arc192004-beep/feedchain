import FeedChainMark from './feedchain-mark';

export default function AppLogo() {
    return (
        <>
            <FeedChainMark className="size-9 shrink-0 rounded-xl shadow-sm ring-1 ring-black/5" />
            <div className="ml-2.5 grid flex-1 text-left leading-tight">
                <span className="truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground">FEEDCHAIN</span>
                <span className="truncate text-[11px] font-medium text-sidebar-foreground/55">Production & Sales</span>
            </div>
        </>
    );
}
