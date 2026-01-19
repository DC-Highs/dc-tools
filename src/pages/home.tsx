import type { FC } from "react"

import { Typography } from "../components/ui/typography"
import { Link } from "../components/ui/link"

const HomePage: FC = () => {
    return (
        <div className="space-y-6">
            <Typography.H1>DC Tools</Typography.H1>
            <Typography.P>
                <strong>DC Tools</strong> is a tool developed by the{" "}
                <Link href="https://github.com/orgs/DC-Highs" target="_blank">
                    DC Highs
                </Link>{" "}
                team - more specifically by the member{" "}
                <Link href="https://github.com/marcuth" target="_blank">
                    Marcuth
                </Link>{" "}
                - to perform static file search operations and search for data related to Dragon City in a more
                intuitive way, without having to manually build URLs and write parameters.
            </Typography.P>
            <Typography.H2>Donate</Typography.H2>
            <Typography.List>
                <Typography.ListItem>
                    Via{" "}
                    <Link href="https://www.buymeacoffee.com/marcuth" target="_blank">
                        Buy Me A Coffee
                    </Link>
                </Typography.ListItem>
                <Typography.ListItem>
                    Via{" "}
                    <Link href="https://ko-fi.com/marcuth" target="_blank">
                        Ko-fi
                    </Link>
                </Typography.ListItem>
                <Typography.ListItem>
                    Via{" "}
                    <Link href="http://livepix.gg/marcuth" target="_blank">
                        LivePix
                    </Link>
                </Typography.ListItem>
                <Typography.ListItem>Via PIX: pix@marcuth.dev</Typography.ListItem>
            </Typography.List>
            <Typography.H2 className="mt-6">License</Typography.H2>
            <Typography.P>
                The project is licensed under the{" "}
                <Link href="https://github.com/DC-Highs/dc-tools/blob/master/LICENSE" target="_blank">
                    MIT
                </Link>{" "}
                license.
            </Typography.P>
        </div>
    )
}

export default HomePage
