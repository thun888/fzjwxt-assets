import json
import os
import glob

HAR_DIR = "G:\\Project\\方正教务"           # HAR 文件目录
OUTPUT_FILE = "rules.json"
GROUP_NAME = "教务系统"
TARGET_DOMAIN = "https://fzjwxt-assets.hzchu.top"


def remove_query(url: str) -> str:
    return url.split("?", 1)[0]


def extract_filename(url: str) -> str:
    return url.rstrip("/").split("/")[-1]


def load_har_entries(har_path: str):
    with open(har_path, "r", encoding="utf-8") as f:
        har = json.load(f)
    return har.get("log", {}).get("entries", [])


def main():
    rules = []
    seen_urls = set()   # ⭐ 跨 HAR 去重

    har_files = glob.glob(os.path.join(HAR_DIR, "*.har"))
    if not har_files:
        print("未找到 HAR 文件")
        return

    for har_file in har_files:
        print(f"处理：{har_file}")
        entries = load_har_entries(har_file)

        for e in entries:
            req = e.get("request", {})
            url = req.get("url")
            if not url:
                continue

            clean_url = remove_query(url)

            if clean_url.endswith(".js"):
                asset_type = "js"
            elif clean_url.endswith(".css"):
                asset_type = "css"
            else:
                continue

            # ⭐ 去重
            if clean_url in seen_urls:
                continue
            seen_urls.add(clean_url)

            filename = extract_filename(clean_url)

            rule = {
                "enable": True,
                "group": GROUP_NAME,
                "ruleType": "redirect",
                "isFunction": False,
                "code": "",
                "forceRunner": "auto",
                "name": filename,
                "condition": {
                    "urlPrefix": clean_url
                },
                "to": f"{TARGET_DOMAIN}/{asset_type}/{filename}",
                "encoding": "UTF-8"
            }

            rules.append(rule)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        output = {
            "request": rules,
            "sendHeader": [],
            "receiveHeader": [],
            "receiveBody": []
        }

        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n完成：共生成 {len(rules)} 条去重规则 → {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
