const DiditKycFrame = () => {
    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1 className="text-lg font-semibold mb-4">Complete your KYC</h1>

            <div className="w-full h-[650px] rounded-xl overflow-hidden border border-white/10">
                <iframe
                    src="https://verify.didit.me/verify/hHM7CFgRIxzJqnUeyVhBNg"
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="camera; microphone; fullscreen; autoplay; encrypted-media"
                    title="didit-kyc"
                />
            </div>
        </div>
    );
};

export default DiditKycFrame;
