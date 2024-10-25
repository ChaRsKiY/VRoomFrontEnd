import React from 'react'
import {Switch} from "@/components/ui/switch";

const PermissionEmailPreference: React.FC = () => {
    return (
        <div className="flex-1">
            <div className="flex items-center space-x-4">
                <Switch />
                <div>
                    <h3>
                        Send me emails about my VRoom activity and updates I requested</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">If this setting is turned off, VRoom may still send you messages regarding your account, required service announcements, legal notifications, and privacy matters</h4>
                </div>
            </div>
        </div>
    )
}

export default PermissionEmailPreference