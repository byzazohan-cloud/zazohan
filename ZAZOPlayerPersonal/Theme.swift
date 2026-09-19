import SwiftUI

struct ZazoTheme {
    static let background = Color(red: 0.035, green: 0.04, blue: 0.065)
    static let card = Color.white.opacity(0.055)
}

struct ZazoChipStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline.bold())
            .foregroundStyle(.white)
            .padding(.horizontal, 15)
            .padding(.vertical, 10)
            .background(Color.white.opacity(configuration.isPressed ? 0.16 : 0.08), in: Capsule())
            .overlay(Capsule().stroke(Color.white.opacity(0.08)))
    }
}
