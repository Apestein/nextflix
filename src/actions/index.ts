import * as profileActions from "~/actions/profile"
import * as myShowActions from "~/actions/my-show"
import * as stripeAction from "~/actions/stripe"

export const sa = {
  profile: profileActions,
  myShow: myShowActions,
  stripe: stripeAction,
}
