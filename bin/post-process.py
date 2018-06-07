#!/usr/bin/env python

import re
import sys

anchor_pattern = re.compile(
    r"^([^{\n]+) {#([^}_]*?)(_[^}]+?(_anchor_id_(.*)_xref[^}]+)?)?}$", re.M
)

literal_pattern = re.compile(
    r"<literal>([^<]+)</literal>", re.M
)

escaped_literal_pattern = re.compile(
    r"&lt;literal&gt;([^&]+)&lt;/literal&gt;", re.M
)

def add_anchors(m):
    title, literal, _, _, term = m.groups()
    if literal or term:
        id = literal or term.replace("_", "-")
        return '\n<div id="{}"></div>\n\n{}'.format(id, title)
    else:
        return '\n{}'.format(title)

def remove_literal_tags(m):
    uri, = m.groups()
    return '{}'.format(uri)

if __name__ == "__main__":
    raw = sys.stdin.read()
    anchored = anchor_pattern.sub(add_anchors, raw)
    deliteraled = literal_pattern.sub(remove_literal_tags, anchored)
    deliteraled = escaped_literal_pattern.sub(remove_literal_tags, deliteraled)

    print(deliteraled)
