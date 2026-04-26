# NL Intents

## Social Extraction Intents

| Request | Intent | Command shape |
| --- | --- | --- |
| 查看我关注了哪些用户 / following list | `list-followed-users` | `node src/entrypoints/sites/x-action.mjs followed-users [--account <handle>]` |
| 下载指定用户历史帖子、回复、图片、视频 | `profile-content` + `download-book` | `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts|replies|media|highlights --download-media` |
| 查看指定用户关注了哪些人 | `list-author-following` | `node src/entrypoints/sites/x-action.mjs profile-following <handle>` |
| 查看关注列表中某天发布的帖子 | `list-followed-updates` | `node src/entrypoints/sites/x-action.mjs followed-posts-by-date --date YYYY-MM-DD [--query <keyword>]` |
| 按关键词搜索相关帖子 | `search-posts` | `node src/entrypoints/sites/x-action.mjs search --query <keyword>` |
| 查看用户账户信息 | `account-info` | `node src/entrypoints/sites/x-action.mjs account-info <handle>` |

## open-book: Content Links (18) X)

| Pattern Type | Examples | Regex |
| --- | --- | --- |
| explicit-intent | 打开18) X | `^(?:请\s*)?(?<verb>打开\|显示\|看看\|下载\|导出\|切换到\|切到\|进入\|去\|选中\|显示)(?:\s*(?:到\|去\|打开)?\s*(?:Content Links \(18\) X\|作品\|影片\|番号\|详情\|书籍\|小说\s*)?(?<targetText>.+?)\s*(?:Content Links \(18\) X\|作品\|影片\|番号\|详情\|书籍\|小说)?)$` |
| implicit-target | 18) X | `^(?<targetText>.+?)(?:\s*(?:Content Links \(18\) X\|作品\|影片\|番号\|详情\|书籍\|小说))?$` |
| status-query | 当前打开的是哪个作品 / 现在在看哪个作品 | `^(?:当前\|现在).*(?:状态\|是否\|打开\|关闭\|展开\|收起)\|^(?:Content Links \(18\) X\|作品\|影片\|番号\|详情\|书籍\|小说).*(?:状态\|是否)$` |

## Set Active Member: Tab Group (For you, Following)

| Pattern Type | Examples | Regex |
| --- | --- | --- |
| explicit-intent | 打开For you | `^(?:请\s*)?(?<verb>打开\|显示\|看看\|下载\|导出\|切换到\|切到\|进入\|去\|选中\|显示)(?:\s*(?:到\|去\|打开)?\s*(?:Tab Group \(For you, Following\|标签\|栏目\|分类\|页签\s*)?(?<targetText>.+?)\s*(?:Tab Group \(For you, Following\|标签\|栏目\|分类\|页签)?)$` |
| implicit-target | For you | `^(?<targetText>.+?)(?:\s*(?:Tab Group \(For you, Following\|标签\|栏目\|分类\|页签))?$` |
| status-query | 当前是哪个标签 / 现在在哪个分类 / 现在在哪个栏目 | `^(?:现在\|当前)?(?:是\|在)?(?:哪个(?:标签\|栏目\|分类)\|当前(?:是\|在)?哪个(?:标签\|栏目\|分类)?)$` |

## Search Book: Search Form

| Pattern Type | Examples | Regex |
| --- | --- | --- |
| explicit-intent | 搜索open source | `^(?:请\s*)?(?<verb>搜索\|搜\|搜一下\|查找\|找书\|搜书\|查书)\s*(?:(?:搜索\|查找\|搜)\s*)?(?<targetText>.+?)$` |
| implicit-target | open source | `^(?:(?:搜索\|查找\|搜))?\s*(?<targetText>.+?)$` |
| status-query | 当前搜索的是什么 / 现在的搜索词是什么 | `^(?:当前\|现在).*(?:状态\|是否\|打开\|关闭\|展开\|收起)\|^(?:Search Form\|搜索框\|搜索\|搜书\|查找).*(?:状态\|是否)$` |
