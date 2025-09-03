import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

function CodeEditor({ code, language = 'rust', readOnly = true, height = '400px' }) {
  return (
    <div className="code-bg overflow-auto" style={{ height }}>
      <Highlight
        theme={themes.vsDark}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 text-sm leading-relaxed`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="select-none text-gray-500 mr-4 inline-block w-8 text-right">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default CodeEditor;