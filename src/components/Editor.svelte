<script>
    "use strict";
    export let markdownContent = `# Sample main heading
Some text.
Some more text, on a new line. **TRY CHANGING ME**

A new paragraph containing a WikiNameLink and a [custom link](https://some.link).
* An unordered list item.
1. An ordered list item.`;
    export let contextCID = '';
    export let contextObj = null;
    export let workflow = undefined;
    let transformedContent = '';
    let accum = '';
    let blockType = '';
    let linesOut = [];

    const rex = {
        // Block level recognition.
        h: /^(#{1,6})(?: *)(.+)/,
        ol: /^(?:\d+[\.\)]? *)(.+)/,
        ul: /^(?:\* *)(.+)/,
        p: /^./,
        // Span level recognition.
        // Bold: double-asterisk followed immediately by a non-space string of non-asterisk characters, followed immediately by a non-space double-asterisk.
        b: /(?:\*\*)(?! )([^\*\*]+)(?! )(?:\*\*)/g,
        // Italic: asterisk followed immediately by a non-space string of non-asterisk characters, followed immediately by a non-space asterisk.
        i: /(?:\*)(?! )([^\*]+)(?! )(?:\*)/g,
        // Regular links: the words http or ftp (s) not part of a custom link, followed by a domain name or query / hash parameters. Very loose and non-compliant.
        a1: /(?<!\[.*\]\()((?:http|ftp)s?:\/\/(?:[\p{L}#\?=]+\.)+[\p{L}#\?=]+)/gu,
        // Custom links - anything goes.
        a2: /\[(.+)\]\((\S+)\)/gu,
        // Simple email recognition - not a validator.
        email: /[A-Za-z0-9_\.]+@[A-Za-z0-9_\.]+/g,
        // WikiNames - easy way to create links between pages.
        wiki: /([A-Z][a-z]+){2,}/g,
    }
    
    // const regex = {
    //     // block level
    //     p: /(?:\n+|^)((?!\* |#{1,6}|\d[ \.\)]).+(?:\n(?!\* |#{1,6}|\d[ \.\)]).+)*)/gu,
    //     // Heading: a line starting with 1-6 hashes (captured) followed by all the string until a newline.
    //     hl: /(?:\n+|^)(#{1,6}) *(.+)/g,
    // };

    function render(data) {
        accum = '';
        linesOut = [];
        blockType = '';
        data.toString()
        // Parse for links.
        .replace(rex.a1, '<a href="$1">$1</a>')
        // Parse for custom links.
        .replace(rex.a2, '<a href="$2">$1</a>')
        // Parse for wiki links.
        .replace(rex.wiki, function(pageName) {
            if (contextObj) {
                return '<a href="#page/'+ contextCID + '/' + pageName + '">' + pageName +
                (contextObj.Links.find(link => link.Name == pageName) ? ' &#x2794;' : '	&#x254B;') + '</a>';
            } else {
                return '<a>' + pageName + '	&#x254B;</a>';
            }
        })
        // Parse for email.
        .replace(rex.email, '<a href="mailto:$1">$1</a>')
        // parse for b (do this after ol, to remove asterisks there)
        .replace(rex.b, '<b>$1</b>')
        // parse for i (do this after ol, to remove asterisks there)
        .replace(rex.i, '<i>$1</i>')
        .split('\n')
        .forEach(function(line) {
        switch(true) {
            case rex.h.test(line): {
                let match = rex.h.exec(line);
                checkBlockTypeChange('h' + (match[1].length));
                accum = (accum ? accum + '<br/>' + match[2] : match[2]);
                break;
            }
            case rex.ul.test(line): {
                let match = rex.ul.exec(line);
                checkBlockTypeChange('ul');
                accum = accum + '<li>' + match[1] + '</li>';
                break;
            }
            case rex.ol.test(line): {
                let match = rex.ol.exec(line);
                checkBlockTypeChange('ol');
                accum = accum + '<li>' + match[1] + '</li>';
                break;
            }
            case rex.p.test(line): {
                checkBlockTypeChange('p');
                accum = (accum ? accum + '<br/>' + line : line);
                break;
            }
            default: {
                if (accum.length) {
                    linesOut.push('<' + blockType + '>' + accum + '</' + blockType + '>' );
                    accum = '';
                }
                blockType = '';
                break;
            }
        }});
        if (accum) {
            linesOut.push('<' + blockType + '>' + accum + '</' + blockType + '>' );
        }
        return linesOut.join('');
    }
  
    function checkBlockTypeChange(newBlockType) {
        if (blockType && newBlockType != blockType) {
            linesOut.push('<' + blockType + '>' + accum + '</' + blockType + '>' );
            accum = '';
        }
        blockType = newBlockType;
    }

    // Render reactively when Preview is selected.
    $: {
        if (['display','preview','practice'].includes(workflow) && markdownContent) {
            transformedContent = render(markdownContent);
        }
    }
</script>

{#if ['edit','practice'].includes(workflow)}
    <h3>Editor</h3>
    <textarea cols="100" bind:value="{markdownContent}" rows="10" style="width:100%;"></textarea>
{/if}
{#if ['display','preview','practice'].includes(workflow)}
    <h3>{'display' == workflow ? 'Content' : 'Preview'}</h3>
    <blockquote bind:innerHTML={transformedContent} contenteditable="false"></blockquote>
{/if}
