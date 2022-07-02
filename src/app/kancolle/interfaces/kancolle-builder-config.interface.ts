import { gkcoiLang } from '../enums/gkcoi-lang.enum'
import { gkcoiTheme } from '../enums/gkcoi-theme.enum'

export interface KanColleBuilderConfig {
  lang?: gkcoiLang
  theme?: gkcoiTheme
  f1?: boolean
  f2?: boolean
  f3?: boolean
  f4?: boolean
  lbas?: boolean
}
