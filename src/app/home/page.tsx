export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-16 max-w-3xl w-full text-center">
        {/* Stylized title with letter spacing and gradient */}
        <h1 className="text-6xl font-extrabold mb-6 tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          H o m e
        </h1>

        {/* Paragraph with subtle letter spacing for elegance */}
        <p className="text-gray-600 text-xl mb-10 tracking-wide">
          W e l c o m e &nbsp;t o &nbsp;t h e &nbsp;N e x t . j s &nbsp;+ &nbsp;S u p a b a s e &nbsp;i n t e r n s h i p &nbsp;p r o j e c t !
        </p>

        {/* Info lines with slight letter spacing */}
        <div className="space-y-6">
          <p className="text-gray-500 text-lg tracking-wide">
            B u i l d , &nbsp;m a n a g e , &nbsp;a n d &nbsp;t r a c k &nbsp;y o u r &nbsp;t a s k s &nbsp;e f f o r t l e s s l y .
          </p>
          <p className="text-gray-500 text-lg tracking-wide">
            C l e a n &nbsp;i n t e r f a c e , &nbsp;m i n i m a l &nbsp;d i s t r a c t i o n s .
          </p>
          <p className="text-gray-500 text-lg tracking-wide">
            K e e p &nbsp;a n &nbsp;e y e &nbsp;o n &nbsp;y o u r &nbsp;p r o d u c t i v i t y &nbsp;a t &nbsp;a &nbsp;g l a n c e .
          </p>
        </div>
      </div>
    </div>
  );
}
