import React from 'react'
import {Switch} from "@/components/ui/switch";

const MyPreferences: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <Switch/>
                <div>
                    <h3>Subscriptions</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me about activity from the channels I'm
                        subscribed to</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch/>
                <div>
                    <h3>Recommended videos</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me of videos I might like based on what I
                        watch</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch/>
                <div>
                    <h3>Activity on my channel</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me about comments and other activity on my
                        channel or videos</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch/>
                <div>
                    <h3>
                        Replies to my comments</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me about activity on my comments and posts on
                        other channels
                    </h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch/>
                <div>
                    <h3>Mentions</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me when others mention my channel</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch/>
                <div>
                    <h3>
                        Shared content</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me when others share my content on their channels</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch/>
                <div>
                    <h3>
                        Promotional content and offerings</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me of promotional content and offerings, like members-only perks</h4>
                </div>
            </div>
        </div>
    )
}

export default MyPreferences