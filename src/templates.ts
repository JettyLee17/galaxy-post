export interface Template {
  name: string;
  render: (content: string, isEditable?: boolean) => string;
}

const getResponsiveStyles = () => `
  <style>
    @media only screen and (max-width: 600px) {
      .inner-padding {
        padding: 20px !important;
      }
      .outer-padding {
        padding: 10px 5px !important;
      }
    }
  </style>
`;

const formatContent = (content: string, color: string = '#444', isEditable: boolean = false) => {
  return `
    <div class="editable-content" 
         ${isEditable ? 'contenteditable="true"' : ''} 
         data-placeholder="在此输入您的信件内容..."
         style="outline: none; min-height: 250px; cursor: ${isEditable ? 'text' : 'default'}; color: ${color}; font-size: 16px; line-height: 1.8; word-break: break-word; overflow-wrap: break-word; text-align: left;">
      ${content}
    </div>`;
};

export const templates: Record<string, Template> = {
  classic: {
    name: '经典信纸',
    render: (content, isEditable) => `
      ${getResponsiveStyles()}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f1ea">
        <tr>
          <td align="center" class="outer-padding" style="padding: 20px 10px;">
            <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #fdfbf7; border: 1px solid #e0d5c1;">
              <tr>
                <td height="4" bgcolor="#8b7355" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
              </tr>
              <tr>
                <td class="inner-padding" style="padding: 40px; font-family: 'Microsoft YaHei', 'SimSun', serif;">
                  ${formatContent(content, '#444', isEditable)}
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
    render: (content, isEditable) => `
      ${getResponsiveStyles()}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0ede4">
        <tr>
          <td align="center" class="outer-padding" style="padding: 20px 10px;">
            <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #e8e2d6; border: 10px solid #ffffff;">
              <tr>
                <td class="inner-padding" style="padding: 20px; font-family: 'STKaiti', '楷体', serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="60" height="80" align="center" valign="middle" style="border: 2px dashed #8b7355; color: #8b7355; font-size: 10px;">
                        邮票
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
                        ${formatContent(content, '#3d3d3d', isEditable)}
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
    render: (content, isEditable) => `
      ${getResponsiveStyles()}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
        <tr>
          <td align="center" class="outer-padding" style="padding: 30px 10px;">
            <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; border: 1px solid #eeeeee;">
              <tr>
                <td class="inner-padding" style="padding: 30px; font-family: 'Microsoft YaHei', Arial, sans-serif;">
                  <div style="margin-bottom: 40px; color: #636e72; font-size: 12px; letter-spacing: 2px;">
                    LETTER / ${new Date().toLocaleDateString('zh-CN')}
                  </div>
                  ${formatContent(content, '#2d3436', isEditable)}
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
    render: (content, isEditable) => `
      ${getResponsiveStyles()}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0f172a">
        <tr>
          <td align="center" class="outer-padding" style="padding: 20px 10px;">
            <!-- Outer Container -->
            <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #1e293b; border: 1px solid #334155;">
              <tr>
                <td class="inner-padding" style="padding: 30px; font-family: 'Microsoft YaHei', Arial, sans-serif;">
                  
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

                  ${formatContent(content, '#e2e8f0', isEditable)}

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
    render: (content, isEditable) => `
      ${getResponsiveStyles()}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1f8e9">
        <tr>
          <td align="center" class="outer-padding" style="padding: 20px 10px;">
            <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #f9fff5; border: 2px solid #a5d6a7;">
              <tr>
                <td class="inner-padding" style="padding: 30px; font-family: 'STKaiti', '楷体', serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right: 20px;">
                        ${formatContent(content, '#2e7d32', isEditable)}
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
  },
  sakura: {
    name: '落樱缤纷',
    render: (content, isEditable) => `
      ${getResponsiveStyles()}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fff5f7">
        <tr>
          <td align="center" class="outer-padding" style="padding: 20px 10px;">
            <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #ffd1dc; border-radius: 8px;">
              <tr>
                <td class="inner-padding" style="padding: 35px; font-family: 'Microsoft YaHei', sans-serif;">
                  <div style="text-align: right; color: #ffb7c5; font-size: 20px; margin-bottom: 20px;">🌸</div>
                  ${formatContent(content, '#d23669', isEditable)}
                  <div style="margin-top: 30px; border-top: 1px dashed #ffd1dc; padding-top: 15px; text-align: center; color: #ffb7c5; font-size: 12px;">
                    春日迟迟，卉木萋萋
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  },
  midnight: {
    name: '深夜食堂',
    render: (content, isEditable) => `
      ${getResponsiveStyles()}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#1a1a1a">
        <tr>
          <td align="center" class="outer-padding" style="padding: 20px 10px;">
            <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #262626; border-left: 4px solid #f1c40f;">
              <tr>
                <td class="inner-padding" style="padding: 30px; font-family: 'Microsoft YaHei', sans-serif;">
                  <div style="color: #f1c40f; font-size: 12px; margin-bottom: 30px; letter-spacing: 2px;">MIDNIGHT JOURNAL</div>
                  ${formatContent(content, '#e0e0e0', isEditable)}
                  <div style="margin-top: 40px; text-align: right;">
                    <span style="color: #f1c40f; font-size: 18px;">🌙</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  },
  elegant: {
    name: '雅致墨韵',
    render: (content, isEditable) => `
      ${getResponsiveStyles()}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f7f2">
        <tr>
          <td align="center" class="outer-padding" style="padding: 20px 10px;">
            <table width="100%" maxWidth="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #333333;">
              <tr>
                <td class="inner-padding" style="padding: 40px; font-family: 'STKaiti', '楷体', serif; position: relative;">
                  <div style="border: 1px solid #333333; padding: 5px; margin-bottom: 20px; display: inline-block; font-size: 12px;">限时信件</div>
                  ${formatContent(content, '#1a1a1a', isEditable)}
                  <div style="margin-top: 50px; text-align: right; border-top: 2px solid #333333; padding-top: 10px;">
                    <span style="font-weight: bold; font-size: 16px;">银河驿站 谨启</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  }
};
