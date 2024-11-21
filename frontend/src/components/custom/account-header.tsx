

export function AccountBarLogin({onClick}:{onClick: () => void}) {
    return(
        <button onClick={()=>{onClick()}} className="p-2 rounded bg-gray-100 hover:bg-gray-200">
            Connect to metamask
        </button>
    )
}

export function AccountBarConnected({accountId}:{accountId: string}) {
    return(
        <div className="flex items-center gap-2">
            <button className="p-2 rounded bg-gray-100 hover:bg-gray-200">
                <span className="text-sm">{accountId}</span>
            </button>
            <button className="p-2 rounded bg-gray-100 hover:bg-gray-200">
                <span className="text-sm">Disconnect</span>
            </button>
        </div>
    )
}