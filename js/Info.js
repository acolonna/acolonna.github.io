class Info {
    static cachedIP;
    static getLocalIP(callback) {
        console.log('[Info.getLocalIP] called')
        if(this.cachedIP) {
            return this.cachedIP;
        }
        const pc = new RTCPeerConnection({iceServers:[]});
        pc.createDataChannel('');
        pc.createOffer().then(pc.setLocalDescription.bind(pc), () => {});
        pc.onicecandidate = (ice) => {
            console.log('[Info.getLocalIP/onicecandidate]');
            console.log(ice);
            if(ice && ice.candidate && ice.candidate.candidate) {
                console.log('[Info.getLocalIP/onicecandidate] Parcing IP from ICE and calling callback');
                const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate)[1];
                callback(myIP);
                pc.onicecandidate = () => {};
            } else {
                console.log('[Info.getLocalIP onicecandidate] Didn\'t like ICE');
            }
        }
    }
}