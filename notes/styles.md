## Semantic Colors
Use semantic names to allow for use-case based usage in components and also allow colors to be swapped out easily at a future date. This also sets me up for doing custom theming down the road.

Consider if I want to do more complex component classes that handle base, hover, active, and dark mode cases or if I just want to have dark mode cases for all of these. I think I'll start with just doing dark mode + scales and handling the component stuff in the actual components instead of the tailwind config.

### Color Palette
- accent
- neutral
- overlay (transparent neutral)
- success
- warning
- danger
- info (maybe not necessary?)

If I just use the colors in the theme then I have to manage dark mode every time. What if I just have a light mode and a dark mode theme and a theme selector or something. Instead of doing it automatically, it just updates the variables? I could have the theme loaded in from a css file dynamically or something? I think I should just not consider light mode right now, and just do dark mode, and think about theming and shit later. Let's just do dark mode with semantic colors.

## Thoughts on focus styles
I don't think I want to have a focus ring. I don't really want this to be like a website with accessibility focus and tabbing through different elements. I want to have keyboard navigation be first class, not just a way to navigate a gui that is built for a mouse. Look at apps like my text editors and Things and stuff for how this can be done in a nice way.
