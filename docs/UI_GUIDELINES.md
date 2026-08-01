# UI Guidelines
# UI GUIDELINES

Version: 1.0

Project:
Task Automation & Job Processing Platform

---

# Design Philosophy

The application must feel like a premium enterprise SaaS platform rather than a traditional admin dashboard.

The overall experience should communicate professionalism, speed, clarity, trust, and modern engineering quality.

The UI should draw inspiration from products such as:

• Linear
• Vercel
• Notion
• Raycast
• Stripe Dashboard
• GitHub
• Figma
• Arc Browser

The design should avoid looking like a Bootstrap template or generic dashboard.

---

# Design Principles

Every screen must follow these principles:

• Simplicity
• Consistency
• Accessibility
• Performance
• Readability
• Minimalism
• Premium Feel
• Responsive Layout
• Predictable Navigation

---

# Visual Identity

The interface should appear:

• Modern
• Elegant
• Lightweight
• Premium
• Spacious
• Clean
• Professional

Avoid unnecessary visual clutter.

Every element must have purpose.

---

# Color Palette

The platform supports both:

• Light Mode
• Dark Mode

Never build separate layouts.

Only colors should change.

---

## Light Theme

Background

Pure White

Secondary Background

Very Light Gray

Cards

White

Primary Text

Near Black

Secondary Text

Slate Gray

Borders

Very Light Gray

Accent

Indigo / Blue

Success

Emerald

Warning

Amber

Error

Rose

Info

Sky Blue

---

## Dark Theme

Background

Dark Slate

Cards

Dark Gray

Elevated Cards

Slightly lighter gray

Primary Text

White

Secondary Text

Gray

Accent

Indigo

Success

Emerald

Warning

Amber

Danger

Red

---

# Theme Switching

Requirements

• Instant switching
• No page refresh
• No layout shifts
• Persist preference
• Smooth transition
• Respect system theme

---

# Typography

Primary Font

Inter

Fallback

System Sans

Font hierarchy

H1

Dashboard Titles

H2

Page Titles

H3

Section Titles

Body

Normal Content

Caption

Metadata

Never use more than two font families.

---

# Spacing System

Use an 8-point grid.

Allowed spacing

4

8

12

16

20

24

32

40

48

64

Avoid random spacing values.

---

# Border Radius

Buttons

12px

Cards

16px

Dialogs

20px

Inputs

12px

Large Cards

20px

Consistency is mandatory.

---

# Shadows

Use soft layered shadows.

Avoid heavy black shadows.

Cards should appear elevated but lightweight.

Dark mode shadows must remain subtle.

---

# Glassmorphism

Glass effects should be used sparingly.

Allowed:

• Navigation
• Floating Panels
• Modals
• Command Palette

Avoid glass on every card.

Transparency should remain subtle.

Backdrop blur should never reduce readability.

---

# Gradients

Use gradients only for:

• Hero areas
• Statistics
• Analytics highlights
• Empty states

Avoid rainbow gradients.

Keep gradients soft.

---

# Icons

Use Lucide Icons.

Requirements

• Consistent size
• Consistent stroke width
• Pixel perfect alignment

Avoid mixing icon libraries.

---

# Layout System

Application layout

Sidebar

↓

Top Navigation

↓

Main Content

↓

Footer (optional)

Main content should never overflow horizontally.

---

# Sidebar

The sidebar must include:

Logo

Navigation

Workspace Switcher

Collapse Button

User Profile

Theme Toggle

The sidebar should collapse on smaller screens.

---

# Top Navigation

Contains:

Search

Notifications

Theme Toggle

Profile Menu

Breadcrumb

Quick Actions

Must remain sticky.

---

# Page Structure

Each page should follow

Header

↓

Toolbar

↓

Statistics

↓

Content

↓

Footer Actions

Maintain consistent spacing.

---

# Responsiveness

Mobile First

Supported widths

320px

375px

425px

768px

1024px

1280px

1440px

1920px

No horizontal scrolling.

---

# Grid System

Cards

Desktop

4 columns

Tablet

2 columns

Mobile

1 column

Charts should resize automatically.

---

# Animations

Use Framer Motion.

Allowed animations

Fade

Slide

Scale

Expand

Collapse

Hover Lift

Card Entrance

Avoid excessive motion.

Animation duration

150–300ms

---

# Accessibility

Minimum contrast ratio

WCAG AA

Keyboard navigation required.

Focus indicators required.

ARIA labels required.

Screen reader friendly.

---

End of Part 1
# Components Design System

Every UI component must follow a consistent design language across the application.

The application should never look like different developers built different pages.

Consistency is mandatory.

---

# Buttons

Button Types

• Primary
• Secondary
• Outline
• Ghost
• Destructive
• Success
• Link
• Icon Button

Requirements

• Rounded corners (12px)
• Smooth hover animation
• Active state
• Disabled state
• Loading state
• Focus ring
• Keyboard accessible

Hover animation:

• Slight elevation
• Soft shadow
• Background transition
• 150–250ms duration

---

# Input Fields

Supported Inputs

• Text
• Password
• Email
• Number
• Search
• Date
• Time
• Textarea
• Select
• Multi Select

Requirements

• Rounded corners
• Floating labels (where appropriate)
• Validation messages
• Error state
• Success state
• Disabled state
• Loading state

---

# Forms

Forms must include:

• Labels
• Helper Text
• Required Indicators
• Validation Messages
• Loading State
• Success Feedback
• Error Feedback

Validation must happen:

• Client Side
• Server Side

---

# Cards

Cards are the primary information container.

Every card should include:

• Soft shadow
• Rounded corners
• Internal padding
• Hover animation
• Responsive layout

Card types:

• Statistic Card
• Analytics Card
• Task Card
• Workflow Card
• Worker Card
• Queue Card
• Profile Card

Cards should never overflow.

Cards should gracefully adapt on smaller screens.

---

# Tables

Tables should support:

• Sticky Header
• Sorting
• Filtering
• Pagination
• Search
• Column Visibility
• Row Selection
• Bulk Actions

Rows should include:

Hover Highlight

Status Badge

Quick Actions

---

# Badges

Supported variants

• Success
• Warning
• Error
• Pending
• Active
• Inactive
• Processing

Badges must remain readable in both themes.

---

# Charts

Supported charts:

• Area Chart
• Line Chart
• Bar Chart
• Pie Chart
• Donut Chart

Charts must support:

• Tooltips
• Legends
• Animation
• Responsive Resize
• Empty State

---

# Sidebar

Sidebar sections:

Logo

↓

Navigation

↓

Workspace Switcher

↓

Quick Actions

↓

Theme Toggle

↓

User Profile

The sidebar must support:

• Collapse
• Expand
• Mobile Drawer
• Active Navigation
• Icons
• Tooltips

---

# Top Navigation

Contains:

• Search
• Notifications
• Breadcrumb
• Theme Toggle
• User Avatar
• Profile Menu

The navbar remains sticky.

---

# Search

Global search must support:

• Debouncing
• Suggestions
• Keyboard Navigation
• Recent Searches

---

# Filters

Filters should include:

• Multi Select
• Date Range
• Status
• Priority
• Queue
• Worker
• User

Filters must collapse on mobile.

---

# Pagination

Desktop

Traditional Pagination

Mobile

Compact Pagination

Support:

• Previous
• Next
• Page Numbers
• Page Size

---

# Dialogs

Dialogs should include:

• Overlay
• Close Button
• ESC Support
• Keyboard Focus Trap

Animation:

Fade + Scale

---

# Drawers

Used for:

• Mobile Navigation
• Settings
• Quick Details

Slide Animation

---

# Toast Notifications

Toast types:

• Success
• Error
• Warning
• Info

Location:

Top Right

Mobile:

Top Center

Auto dismiss after 4 seconds.

---

# Tooltips

Tooltips should appear after a short delay.

Avoid unnecessary tooltips.

---

# Dropdown Menus

Support:

• Icons
• Keyboard Navigation
• Nested Menus
• Active Item
• Disabled Item

---

# Tabs

Animated underline

Keyboard accessible

Lazy loaded where appropriate.

---

# Accordions

Smooth expand/collapse.

Used for:

Settings

Logs

Advanced Options

---

# Progress Indicators

Use:

Progress Bars

Circular Progress

Loading Indicators

Progress should animate smoothly.

---

# Status Indicators

Every status should have:

• Icon
• Label
• Color
• Tooltip

Never rely only on color.

---

# Loading States

Every page must include:

• Skeleton Loader
• Spinner
• Progress Bar

Never show blank screens.

---

# Empty States

Every empty page must include:

• Illustration/Icon
• Title
• Description
• Call-to-Action Button

Example:

"No Tasks Yet"

Create your first task.

---

# Error States

Error screens should include:

• Friendly Message
• Retry Button
• Error Details (Development)

---

# Images

Requirements:

• Lazy Loading
• Responsive Sizes
• No Stretching
• Rounded Corners
• Proper Aspect Ratio
• Placeholder while loading

Images should never cause layout shifts.

---

# Avatars

Support:

• Image
• Initials
• Online Status
• Offline Status

---

# Theme Transition

Switching themes must:

• Be smooth
• Preserve scroll position
• Not trigger layout shift

---

# Motion Guidelines

Animation Duration

150–300ms

Animation Curve

Ease In Out

Allowed:

• Fade
• Scale
• Slide
• Hover Lift

Avoid excessive animations.

---

# Mobile Experience

Navigation becomes Drawer.

Cards become single-column.

Tables become responsive cards where needed.

Buttons become full width when appropriate.

Touch targets must be at least 44px.

---

# Tablet Experience

Two-column layouts.

Responsive charts.

Collapsible sidebar.

---

# Desktop Experience

Multi-column dashboards.

Persistent sidebar.

Large analytics panels.

Keyboard shortcuts.

---

# Image & Media Optimization

Images:

• Lazy Loaded
• Compressed
• Modern formats where possible

Videos:

• Responsive
• Lazy loaded

---

# Micro Interactions

Every interactive element should provide feedback.

Examples:

• Button Hover
• Card Hover
• Input Focus
• Success Animation
• Delete Confirmation
• Loading Transition
• Skeleton Fade

Micro-interactions should enhance usability without distracting users.

---

# Final UI Principles

Every screen should feel:

• Premium
• Elegant
• Fast
• Modern
• Consistent
• Responsive
• Accessible
• Production Ready

The UI must maintain the same design language across every feature and module. No component should feel visually out of place.

End of UI Guidelines