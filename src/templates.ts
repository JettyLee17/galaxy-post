export interface Template {
  name: string;
  render: (content: string) => string;
}

const formatContent = (content: string, color: string = '#444') => {
  if (!content) return `<p style="color: #999; font-style: italic; margin: 0; padding: 0;">信件内容将显示在此处...</p>`;
  return content
    .split('\n')
    .map(line => line.trim()
      ? `<p style="margin: 0 0 1em 0; line-height: 1.8; color: ${color}; font-size: 16px;">${line}</p>`
      : '<div style="height: 1em;"></div>')
    .join('');
};

export const templates: Record<string, Template> = {
  classic: {
    name: '经典信纸',
    render: (content) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f1ea">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #fdfbf7; border: 1px solid #e0d5c1;">
              <tr>
                <td height="4" bgcolor="#8b7355" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding: 40px; font-family: 'Microsoft YaHei', 'SimSun', serif;">
                  ${formatContent(content, '#444')}
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 60px;">
                    <tr>
                      <td align="right" style="border-top: 1px solid #e0d5c1; padding-top: 20px; font-style: italic; color: #8b7355; font-size: 14px;">
                        此致，敬礼
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  },
  postcard: {
    name: '复古明信片',
    render: (content) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0ede4">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e2d6; border: 15px solid #ffffff;">
              <tr>
                <td style="padding: 30px; font-family: 'STKaiti', '楷体', serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="80" height="100" align="center" valign="middle" style="border: 2px dashed #8b7355; color: #8b7355; font-size: 12px;">
                        邮票贴于此处
                      </td>
                      <td align="right" valign="top">
                        <div style="font-size: 24px; font-weight: bold; color: #8b7355; border-bottom: 2px solid #8b7355; display: inline-block; padding-bottom: 5px;">POSTCARD</div>
                        <div style="font-size: 10px; color: #8b7355; margin-top: 5px; letter-spacing: 1px;">GALAXY POST SERVICE</div>
                      </td>
                    </tr>
                  </table>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
                    <tr>
                      <td style="border-left: 2px solid #8b7355; padding-left: 20px; min-height: 200px;">
                        ${formatContent(content, '#3d3d3d')}
                      </td>
                    </tr>
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
                    <tr>
                      <td align="right">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="width: 80px; height: 80px; border: 2px solid #8b7355; border-radius: 50%; color: #8b7355; font-size: 12px; font-weight: bold; opacity: 0.5;">
                              GALAXY<br/>STATION<br/>2026
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  },
  minimalist: {
    name: '现代极简',
    render: (content) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
        <tr>
          <td align="center" style="padding: 50px 0;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #eeeeee;">
              <tr>
                <td style="padding: 50px; font-family: 'Microsoft YaHei', Arial, sans-serif;">
                  <div style="margin-bottom: 40px; color: #636e72; font-size: 12px; letter-spacing: 2px;">
                    LETTER / ${new Date().toLocaleDateString('zh-CN')}
                  </div>
                  ${formatContent(content, '#2d3436')}
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 60px;">
                    <tr>
                      <td width="40" height="1" bgcolor="#dfe6e9" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                      <td style="padding-left: 15px; color: #b2bec3; font-size: 12px;">End of Message</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  },
  starry: {
    name: '星空之境',
    render: (content) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0f172a">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <!-- Outer Container -->
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #1e293b; border: 1px solid #334155;">
              <tr>
                <td style="padding: 40px; font-family: 'Microsoft YaHei', Arial, sans-serif;">
                  
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                      <td width="3" bgcolor="#38bdf8" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                      <td style="padding-left: 20px; color: #38bdf8; font-size: 12px; letter-spacing: 1px;">
                        FROM THE GALAXY
                      </td>
                      <td align="right">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="40" height="40" bgcolor="#fbbf24" style="border-radius: 50%; font-size: 1px; line-height: 1px;">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  ${formatContent(content, '#e2e8f0')}

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 50px;">
                    <tr>
                      <td align="center" style="color: #64748b; font-size: 12px;">
                        ✨ 发自遥远的星系
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  },
  bamboo: {
    name: '青竹幽境',
    render: (content) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1f8e9">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fff5; border: 2px solid #a5d6a7;">
              <tr>
                <td style="padding: 40px; font-family: 'STKaiti', '楷体', serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right: 20px;">
                        ${formatContent(content, '#2e7d32')}
                      </td>
                      <td width="1" bgcolor="#a5d6a7" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                      <td width="20" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                    </tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
                    <tr>
                      <td align="right" style="color: #81c784; font-size: 14px;">
                        🎋 竹报平安
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  }
};
