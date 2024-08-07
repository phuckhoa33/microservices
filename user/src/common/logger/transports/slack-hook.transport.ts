import SlackHook from 'winston-slack-webhook-transport';
import * as process from 'process';
import {TransformableInfo} from 'logform';

export class SlackHookTransport {
    getInstance() {
        return new SlackHook({
            webhookUrl: process.env.LOGGER_SLACK_WEB_HOOK_URL,
            channel: process.env.LOGGER_SLACK_CHANNEL,
            username: process.env.LOGGER_SLACK_USERNAME,
            level: process.env.LOGGER_SLACK_LEVEL,
            formatter: (info: TransformableInfo) => {
                const text = `[${info.meta.hostName}]-[${info.meta.context}]-[${info.meta.ip}] :fire:${info.level.toUpperCase()}: ${info.message} \n${info.meta.method} ${info.meta.path}`;
                const attachments = [
                    {
                        color: 'danger',
                        mrkdwn_in: ['text'],
                        fields: [
                            {
                                title: 'Trace',
                                value: info.meta.trace,
                                short: false,
                            },
                        ],
                    },
                ];

                if (info.meta.header) {
                    attachments.push({
                        color: 'warning',
                        mrkdwn_in: ['text'],
                        fields: [
                            {
                                title: 'Header',
                                value: info.meta.header,
                                short: false,
                            },
                        ],
                    });
                }

                if (info.meta.body) {
                    attachments.push({
                        color: 'warning',
                        mrkdwn_in: ['text'],
                        fields: [
                            {
                                title: 'Body',
                                value: info.meta.body,
                                short: false,
                            },
                        ],
                    });
                }

                return {
                    text: text,
                    attachments: attachments,
                };
            },
        });
    }
}