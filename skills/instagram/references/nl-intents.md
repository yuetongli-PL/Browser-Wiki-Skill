# NL Intents

## Operational Natural Language Shortcuts

| Request | Intent | Command shape |
| --- | --- | --- |
| IG 全量续跑 `<handle>` / resume Instagram full archive | `resume-full-archive` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts --full-archive --run-dir <previous-or-new-run>` |
| Instagram 限流冷却后继续 / continue IG after cooldown | `resume-after-cooldown` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts --full-archive --risk-backoff-ms <ms> --risk-retries <n>` |
| 高速下载 IG 媒体 / fast Instagram media download | `media-fast-download` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type media --download-media --max-media-downloads <n>` |
| 检查 Instagram 登录健康 / IG health check | `health-check` | `node scripts/social-auth-recover.mjs --execute --site instagram --verify` |
| 生成 Instagram live 验收报告 / IG live acceptance report | `live-acceptance-report` | `node scripts/social-live-verify.mjs --execute --site instagram --ig-account <handle>` |
| 刷新 Instagram KB / IG scenario KB refresh | `kb-refresh` | `node scripts/social-kb-refresh.mjs --execute --site instagram --ig-account <handle>` |

## Social Extraction Intents

| Request | Intent | Command shape |
| --- | --- | --- |
| 查看我关注了哪些用户 / following list | `list-followed-users` | `node src/entrypoints/sites/instagram-action.mjs followed-users [--account <handle>]` |
| 下载指定用户历史帖子、图片、视频、Reels、Highlights | `profile-content` + `download-book` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts|reels|media|highlights --download-media` |
| 查看指定用户关注了哪些人 | `list-author-following` | `node src/entrypoints/sites/instagram-action.mjs profile-following <handle>` |
| 查看关注列表中某天发布的帖子 | `list-followed-updates` | `node src/entrypoints/sites/instagram-action.mjs followed-posts-by-date --date YYYY-MM-DD` |
| 按关键词搜索相关帖子 | `search-content` | `node src/entrypoints/sites/instagram-action.mjs search --query <keyword>` |
| 查看用户账户信息 | `account-info` | `node src/entrypoints/sites/instagram-action.mjs account-info <handle>` |

## open-book: Content Links (Instagram)

| Pattern Type | Examples | Regex |
| --- | --- | --- |
| explicit-intent | 打开Instagram | `^(?:请\s*)?(?<verb>打开\|显示\|看看\|下载\|导出\|切换到\|切到\|进入\|去\|选中\|显示)(?:\s*(?:到\|去\|打开)?\s*(?:Content Links \(Instagram\|作品\|影片\|番号\|详情\|书籍\|小说\s*)?(?<targetText>.+?)\s*(?:Content Links \(Instagram\|作品\|影片\|番号\|详情\|书籍\|小说)?)$` |
| implicit-target | Instagram | `^(?<targetText>.+?)(?:\s*(?:Content Links \(Instagram\|作品\|影片\|番号\|详情\|书籍\|小说))?$` |
| status-query | 当前打开的是哪个作品 / 现在在看哪个作品 | `^(?:当前\|现在).*(?:状态\|是否\|打开\|关闭\|展开\|收起)\|^(?:Content Links \(Instagram\|作品\|影片\|番号\|详情\|书籍\|小说).*(?:状态\|是否)$` |

## open profile: Author Links (Instagram)

| Pattern Type | Examples | Regex |
| --- | --- | --- |
| explicit-intent | 打开Instagram | `^(?:请\s*)?(?<verb>打开\|显示\|看看\|下载\|导出\|切换到\|切到\|进入\|去\|选中\|显示)(?:\s*(?:到\|去\|打开)?\s*(?:Author Links \(Instagram\|女优页\|作者页\|女优\|演员\|作者\s*)?(?<targetText>.+?)\s*(?:Author Links \(Instagram\|女优页\|作者页\|女优\|演员\|作者)?)$` |
| implicit-target | Instagram | `^(?<targetText>.+?)(?:\s*(?:Author Links \(Instagram\|女优页\|作者页\|女优\|演员\|作者))?$` |
| status-query | 当前打开的是哪个女优页 / 现在在哪个女优页 | `^(?:当前\|现在).*(?:状态\|是否\|打开\|关闭\|展开\|收起)\|^(?:Author Links \(Instagram\|女优页\|作者页\|女优\|演员\|作者).*(?:状态\|是否)$` |
